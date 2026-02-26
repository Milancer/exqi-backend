import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  InterviewSession,
  SessionStatus,
} from './entities/interview-session.entity';
import { InterviewResponse } from './entities/interview-response.entity';
import { CompetencyQuestion } from '../cbi/entities/competency-question.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitInterviewDto } from './dto/submit-interview.dto';
import { UserRole } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { UpdateScoresDto } from './dto/update-scores.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(InterviewSession)
    private readonly sessionRepo: Repository<InterviewSession>,
    @InjectRepository(InterviewResponse)
    private readonly responseRepo: Repository<InterviewResponse>,
    @InjectRepository(CompetencyQuestion)
    private readonly questionRepo: Repository<CompetencyQuestion>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /* ───── Authenticated endpoints ───── */

  async create(dto: CreateInterviewDto, user: any): Promise<InterviewSession> {
    // 1. Fetch and validate template
    const template = await this.sessionRepo.manager
      .getRepository('CbiTemplate')
      .findOne({ where: { cbi_template_id: dto.cbi_template_id } });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // 2. Resolve Questions (Snapshot)
    let questions: CompetencyQuestion[] = [];

    // Strategy A: Template has explicit question IDs
    if (template.questions && template.questions.length > 0) {
      questions = await this.questionRepo.find({
        where: { competency_question_id: In(template.questions) },
        relations: ['competency'],
      });
    }
    // Strategy B: Template has competencies but no explicit questions (dynamic resolution)
    else if (template.competencies && template.competencies.length > 0) {
      for (const comp of template.competencies) {
        const matchingQuestions = await this.questionRepo.find({
          where: {
            competency_id: comp.competency_id,
            level: comp.level,
            client_id: In([1, user.clientId || 1]), // Global or Client-Specific
            status: 'Active',
          },
          relations: ['competency'],
        });
        questions.push(...matchingQuestions);
      }
    } else {
      throw new BadRequestException(
        'Template has no questions or competencies defined.',
      );
    }

    // Map to simple object structure for snapshot
    const questionSnapshot = questions.map((q) => ({
      question_id: q.competency_question_id,
      competency_id: q.competency_id,
      question_text: q.question,
      competency_name: q.competency?.competency || 'Unknown',
      level: q.level,
    }));

    if (questionSnapshot.length === 0) {
      throw new BadRequestException(
        'Could not find any valid questions for this template. Please ensure the template has competencies with active questions.',
      );
    }

    // 3. Create session with snapshot
    const expiresInHours = dto.expires_in_hours || 48;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const session = this.sessionRepo.create({
      candidate_id: dto.candidate_id,
      cbi_template_id: dto.cbi_template_id,
      interviewer_id: dto.interviewer_id,
      token: uuidv4(),
      status: SessionStatus.PENDING,
      expires_at: expiresAt,
      client_id: user.role === UserRole.ADMIN ? 1 : user.clientId,
      questions: questionSnapshot, // Save snapshot
    });

    const saved = await this.sessionRepo.save(session);

    // 4. Notify interviewer
    await this.notificationsService.create({
      user_id: dto.interviewer_id,
      type: NotificationType.INTERVIEW_ASSIGNED,
      title: 'Interview Assigned',
      message: `You have been assigned a new interview session.`,
      reference_type: 'interview_session',
      reference_id: saved.session_id,
      client_id: saved.client_id,
    });

    return this.findOne(saved.session_id, user);
  }

  async findAll(user: any): Promise<InterviewSession[]> {
    const where: any = {};
    if (user.role !== UserRole.ADMIN) {
      where.client_id = user.clientId;
    }
    return this.sessionRepo.find({
      where,
      relations: ['candidate', 'template', 'interviewer'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, user: any): Promise<InterviewSession> {
    const session = await this.sessionRepo.findOne({
      where: { session_id: id },
      relations: ['candidate', 'template', 'interviewer'],
    });
    if (!session) throw new NotFoundException('Interview session not found');
    if (user.role !== UserRole.ADMIN && session.client_id !== user.clientId) {
      throw new ForbiddenException();
    }
    return session;
  }

  async getResponses(
    sessionId: number,
    user: any,
  ): Promise<InterviewResponse[]> {
    await this.findOne(sessionId, user); // access check
    return this.responseRepo.find({
      where: { session_id: sessionId },
      order: { response_id: 'ASC' },
    });
  }

  async cancel(id: number, user: any): Promise<InterviewSession> {
    const session = await this.findOne(id, user);
    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed session');
    }
    session.status = SessionStatus.EXPIRED;
    return this.sessionRepo.save(session);
  }

  /* ───── Public (token-based) endpoints ───── */

  async getByToken(token: string): Promise<any> {
    const session = await this.sessionRepo.findOne({
      where: { token },
      relations: ['candidate', 'template', 'interviewer'],
    });
    if (!session) throw new NotFoundException('Interview not found');

    // Check if expired
    if (
      new Date() > session.expires_at &&
      session.status !== SessionStatus.COMPLETED
    ) {
      session.status = SessionStatus.EXPIRED;
      await this.sessionRepo.save(session);
    }
    if (session.status === SessionStatus.EXPIRED) {
      throw new BadRequestException('This interview link has expired');
    }
    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException(
        'This interview has already been completed',
      );
    }

    // Mark as in progress on first access
    if (session.status === SessionStatus.PENDING) {
      session.status = SessionStatus.IN_PROGRESS;
      await this.sessionRepo.save(session);
    }

    // Use the snapshot of questions from creation time
    // If for some reason the snapshot is empty (legacy sessions), fall back to template
    let resolvedQuestions = session.questions || [];

    if (resolvedQuestions.length === 0 && session.template?.questions?.length) {
      // Fallback for legacy data (resolve dynamically)
      const questions = await this.questionRepo.find({
        where: { competency_question_id: In(session.template.questions) },
        relations: ['competency'],
      });

      resolvedQuestions = session.template.questions
        .map((qId) => questions.find((q) => q.competency_question_id === qId))
        .filter((q): q is CompetencyQuestion => q !== undefined)
        .map((q) => ({
          question_id: q.competency_question_id,
          competency_id: q.competency_id,
          question_text: q.question,
          competency_name: q.competency?.competency || 'Unknown',
          level: q.level,
        }));
    } else if (resolvedQuestions.length === 0) {
      // If still empty (e.g. template has no questions), return empty array
      resolvedQuestions = [];
    }

    // Determine template name (handle if template is null/deleted)
    const templateName = session.template?.template_name || 'Interview';
    const templateId = session.template?.cbi_template_id || 0;

    return {
      session_id: session.session_id,
      candidate: session.candidate,
      template: {
        cbi_template_id: templateId,
        template_name: templateName,
      },
      questions: resolvedQuestions,
      interviewer: {
        name: session.interviewer.name,
        surname: session.interviewer.surname,
      },
      status: session.status,
      expires_at: session.expires_at,
    };
  }

  async submitByToken(
    token: string,
    dto: SubmitInterviewDto,
  ): Promise<{ message: string; percentage: number }> {
    const session = await this.sessionRepo.findOne({
      where: { token },
      relations: ['candidate'],
    });

    if (!session) throw new NotFoundException('Interview not found');

    if (
      new Date() > session.expires_at &&
      session.status !== SessionStatus.COMPLETED
    ) {
      session.status = SessionStatus.EXPIRED;
      await this.sessionRepo.save(session);
      throw new BadRequestException('This interview link has expired');
    }

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException(
        'This interview has already been completed',
      );
    }

    // Save responses
    const responses = dto.responses.map((r) => {
      const response = new InterviewResponse();
      response.session_id = session.session_id;
      response.question_id = r.question_id;
      response.competency_id = r.competency_id;
      response.rating = r.rating || 0;
      response.notes = r.notes || undefined;
      response.behavioral_flags = r.behavioral_flags || undefined;
      return response;
    });
    await this.responseRepo.save(responses);

    // Calculate scores
    const totalScore = dto.responses.reduce(
      (sum, r) => sum + (r.rating || 0),
      0,
    );
    const maxPossible = dto.responses.length * 5;
    const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

    session.total_score = totalScore;
    session.max_possible_score = maxPossible;
    session.percentage = Math.round(percentage * 100) / 100;
    session.status = SessionStatus.COMPLETED;
    session.completed_at = new Date();
    await this.sessionRepo.save(session);

    // Notify the session creator (all admins + office managers of the same client)
    await this.notificationsService.create({
      user_id: session.interviewer_id,
      type: NotificationType.INTERVIEW_COMPLETED,
      title: 'Interview Completed',
      message: `Interview for ${session.candidate?.name} ${session.candidate?.surname} has been completed. Score: ${session.percentage}%`,
      reference_type: 'interview_session',
      reference_id: session.session_id,
      client_id: session.client_id,
    });

    return {
      message: 'Interview submitted successfully',
      percentage: session.percentage,
    };
  }
  async updateScores(
    sessionId: number,
    dto: UpdateScoresDto,
    user: any,
  ): Promise<InterviewSession> {
    const session = await this.findOne(sessionId, user);

    // Update ratings
    for (const scoreItem of dto.scores) {
      await this.responseRepo.update(
        { response_id: scoreItem.response_id, session_id: sessionId },
        { rating: scoreItem.rating },
      );
    }

    // Recalculate Session Score
    const responses = await this.responseRepo.find({
      where: { session_id: sessionId },
    });

    const totalScore = responses.reduce((sum, r) => sum + (r.rating || 0), 0);
    const maxPossible = responses.length * 5;
    const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

    session.total_score = totalScore;
    session.max_possible_score = maxPossible;
    session.percentage = Math.round(percentage * 100) / 100;

    // Ensure status is Completed (if not already)
    if (session.status !== SessionStatus.COMPLETED) {
      session.status = SessionStatus.COMPLETED;
      session.completed_at = new Date();
    }

    return this.sessionRepo.save(session);
  }
}

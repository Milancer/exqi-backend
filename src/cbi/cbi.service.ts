import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CbiTemplate } from './entities/cbi-template.entity';
import { CompetencyQuestion } from './entities/competency-question.entity';
import { CreateCbiTemplateDto } from './dto/create-cbi-template.dto';
import { UpdateCbiTemplateDto } from './dto/update-cbi-template.dto';
import { CreateCompetencyQuestionDto } from './dto/competency-question/create-competency-question.dto';
import { UpdateCompetencyQuestionDto } from './dto/competency-question/update-competency-question.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class CbiService {
  constructor(
    @InjectRepository(CbiTemplate)
    private readonly cbiTemplateRepository: Repository<CbiTemplate>,
    @InjectRepository(CompetencyQuestion)
    private readonly questionRepository: Repository<CompetencyQuestion>,
  ) {}

  // Create CBI Template (ADMIN, OFFICE_MANAGER, CBI_USER)
  async createTemplate(createDto: CreateCbiTemplateDto, user: any) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can create CBI templates',
      );
    }

    const template = this.cbiTemplateRepository.create({
      ...createDto,
      client_id: user.clientId,
    });

    const saved = await this.cbiTemplateRepository.save(template);

    // Auto-generate questions based on competencies
    if (saved.competencies && saved.competencies.length > 0) {
      return this.generateQuestionsFromTemplate(saved.cbi_template_id, user);
    }

    return saved;
  }

  // Get all templates (multi-tenancy)
  async findAllTemplates(user: any) {
    // ... (unchanged)
    // ADMIN sees all templates
    if (user.role === UserRole.ADMIN) {
      return this.cbiTemplateRepository.find({
        where: { status: 'Active' },
      });
    }

    // Others see global (client_id=1) + their own client's templates
    return this.cbiTemplateRepository.find({
      where: [
        { status: 'Active', client_id: 1 },
        { status: 'Active', client_id: user.clientId },
      ],
    });
  }

  // Get single template
  async findOneTemplate(id: number, user: any) {
    // ... (unchanged)
    const template = await this.cbiTemplateRepository.findOne({
      where: { cbi_template_id: id },
    });

    if (!template) {
      throw new NotFoundException(`CBI Template with ID ${id} not found`);
    }

    // Check access: ADMIN sees all, others see only their client's templates
    if (user.role !== UserRole.ADMIN && template.client_id !== user.clientId) {
      throw new ForbiddenException('Access denied to this template');
    }

    return template;
  }

  // Update template (ADMIN, OFFICE_MANAGER, CBI_USER for their own client)
  async updateTemplate(id: number, updateDto: UpdateCbiTemplateDto, user: any) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can update CBI templates',
      );
    }

    const existing = await this.findOneTemplate(id, user); // ensures access
    // Non-admins cannot edit global templates (client_id=1) — those are
    // shipped/curated by Anthropic-side admins and shared across tenants.
    if (user.role !== UserRole.ADMIN && existing.client_id === 1) {
      throw new ForbiddenException(
        'Global CBI templates can only be edited by ADMIN',
      );
    }
    await this.cbiTemplateRepository.update(id, updateDto);

    // Auto-regenerate questions if competencies changed
    if (updateDto.competencies) {
      return this.generateQuestionsFromTemplate(id, user);
    }

    return this.findOneTemplate(id, user);
  }

  // Delete template (soft delete, ADMIN/OFFICE_MANAGER/CBI_USER for their own client)
  async removeTemplate(id: number, user: any) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can delete CBI templates',
      );
    }

    const existing = await this.findOneTemplate(id, user); // ensures access
    if (user.role !== UserRole.ADMIN && existing.client_id === 1) {
      throw new ForbiddenException(
        'Global CBI templates can only be deleted by ADMIN',
      );
    }
    await this.cbiTemplateRepository.update(id, { status: 'Deleted' });
    return { message: 'CBI Template deleted successfully' };
  }

  // Generate questions from template competencies
  async generateQuestionsFromTemplate(templateId: number, user: any) {
    const template = await this.findOneTemplate(templateId, user);

    if (!template.competencies || template.competencies.length === 0) {
      throw new NotFoundException(
        'Template has no competencies defined. Please add competencies first.',
      );
    }

    const generatedQuestions: number[] = [];

    // For each competency in the template
    for (const comp of template.competencies) {
      const whereClause: any = {
        competency_id: comp.competency_id,
        level: comp.level,
        status: 'Active',
      };

      // Multi-tenancy: include global + client questions
      if (user.role !== UserRole.ADMIN) {
        whereClause.client_id = In([1, user.clientId]);
      }

      // Get ALL available questions for this competency + level
      const availableQuestions = await this.questionRepository.find({
        where: whereClause,
      });

      // Add all question IDs to the template
      const questionIds = availableQuestions.map(
        (q) => q.competency_question_id,
      );

      generatedQuestions.push(...questionIds);
    }

    // Update template with generated questions
    await this.cbiTemplateRepository.update(templateId, {
      questions: generatedQuestions,
    });

    return this.findOneTemplate(templateId, user);
  }

  // CompetencyQuestion CRUD (Question Bank)
  async createQuestion(dto: CreateCompetencyQuestionDto, user: any) {
    // ADMIN creates global questions (client_id=1)
    // OFFICE_MANAGER + CBI_USER create client-specific questions
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can create questions',
      );
    }

    const question = this.questionRepository.create({
      ...dto,
      client_id: user.clientId,
    });

    return this.questionRepository.save(question);
  }

  async findAllQuestions(
    user: any,
    competencyId?: number,
    level?: number,
    page?: number,
    limit?: number,
    status?: string,
  ) {
    const whereClause: any = {};

    // Status filter — default to Active+Inactive
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = In(['Active', 'Inactive']);
    }

    // Multi-tenancy: show global (client_id=1) + user's client questions
    if (user.role !== UserRole.ADMIN) {
      whereClause.client_id = In([1, user.clientId]); // Global + own
    }

    // Optional filters
    if (competencyId) {
      whereClause.competency_id = competencyId;
    }
    if (level) {
      whereClause.level = level;
    }

    // Paginated response
    const take = limit && limit > 0 ? Math.min(limit, 200) : 50;
    const skip = page && page > 1 ? (page - 1) * take : 0;

    const [data, total] = await this.questionRepository.findAndCount({
      where: whereClause,
      relations: ['competency'],
      order: { competency_question_id: 'DESC' },
      take,
      skip,
    });

    return { data, total, page: page || 1, limit: take };
  }

  async findOneQuestion(id: number, user: any) {
    const question = await this.questionRepository.findOne({
      where: { competency_question_id: id },
      relations: ['competency'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Check access: ADMIN sees all, others see global + own client
    if (
      user.role !== UserRole.ADMIN &&
      question.client_id !== 1 &&
      question.client_id !== user.clientId
    ) {
      throw new ForbiddenException('Access denied to this question');
    }

    return question;
  }

  async updateQuestion(
    id: number,
    dto: UpdateCompetencyQuestionDto,
    user: any,
  ) {
    // ADMIN can update any question
    // OFFICE_MANAGER + CBI_USER can only update their client's questions
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can update questions',
      );
    }

    const question = await this.findOneQuestion(id, user);

    if (
      user.role !== UserRole.ADMIN &&
      question.client_id !== user.clientId
    ) {
      throw new ForbiddenException(
        'You can only update your own client questions',
      );
    }

    await this.questionRepository.update(id, dto);
    return this.findOneQuestion(id, user);
  }

  async removeQuestion(id: number, user: any) {
    // ADMIN can delete any question
    // OFFICE_MANAGER + CBI_USER can only delete their client's questions
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.CBI_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER and CBI_USER can delete questions',
      );
    }

    const question = await this.findOneQuestion(id, user);

    if (
      user.role !== UserRole.ADMIN &&
      question.client_id !== user.clientId
    ) {
      throw new ForbiddenException(
        'You can only delete your own client questions',
      );
    }

    await this.questionRepository.update(id, { status: 'Deleted' });
    return { message: 'Question deleted successfully' };
  }
}

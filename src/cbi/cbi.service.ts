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

  // Create CBI Template (ADMIN only)
  async createTemplate(createDto: CreateCbiTemplateDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can create CBI templates');
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

  // Update template (ADMIN only)
  async updateTemplate(id: number, updateDto: UpdateCbiTemplateDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can update CBI templates');
    }

    await this.findOneTemplate(id, user); // Ensure template exists and user has access
    await this.cbiTemplateRepository.update(id, updateDto);

    // Auto-regenerate questions if competencies changed
    if (updateDto.competencies) {
      return this.generateQuestionsFromTemplate(id, user);
    }

    return this.findOneTemplate(id, user);
  }

  // Delete template (soft delete, ADMIN only)
  async removeTemplate(id: number, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can delete CBI templates');
    }

    await this.findOneTemplate(id, user); // Ensure template exists and user has access
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
    // OFFICE_MANAGER creates client-specific questions
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can create questions',
      );
    }

    const question = this.questionRepository.create({
      ...dto,
      client_id: user.clientId,
    });

    return this.questionRepository.save(question);
  }

  async findAllQuestions(user: any, competencyId?: number, level?: number) {
    const whereClause: any = { status: In(['Active', 'Inactive']) };

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

    return this.questionRepository.find({
      where: whereClause,
      relations: ['competency'],
    });
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
    // OFFICE_MANAGER can only update their client's questions
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can update questions',
      );
    }

    const question = await this.findOneQuestion(id, user);

    // OFFICE_MANAGER can only update their own client's questions
    if (
      user.role === UserRole.OFFICE_MANAGER &&
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
    // OFFICE_MANAGER can only delete their client's questions
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can delete questions',
      );
    }

    const question = await this.findOneQuestion(id, user);

    // OFFICE_MANAGER can only delete their own client's questions
    if (
      user.role === UserRole.OFFICE_MANAGER &&
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

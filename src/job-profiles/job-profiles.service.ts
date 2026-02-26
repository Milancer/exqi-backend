import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';
import { AddCompetencyDto } from './dto/add-competency.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { AddDeliverableDto } from './dto/add-deliverable.dto';
import { UpdateRequirementsDto } from './dto/update-requirements.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class JobProfilesService {
  constructor(
    @InjectRepository(JobProfile)
    private readonly jobProfileRepository: Repository<JobProfile>,
    @InjectRepository(JobProfileCompetency)
    private readonly jobProfileCompetencyRepository: Repository<JobProfileCompetency>,
    @InjectRepository(JobProfileSkill)
    private readonly jobProfileSkillRepository: Repository<JobProfileSkill>,
    @InjectRepository(JobProfileDeliverable)
    private readonly jobProfileDeliverableRepository: Repository<JobProfileDeliverable>,
    @InjectRepository(JobProfileRequirement)
    private readonly jobProfileRequirementRepository: Repository<JobProfileRequirement>,
  ) {}

  // Create job profile
  async create(dto: CreateJobProfileDto, user: any) {
    // ADMIN and OFFICE_MANAGER can create job profiles
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can create job profiles',
      );
    }

    const jobProfile = this.jobProfileRepository.create({
      ...dto,
      client_id: user.clientId,
      user_id: user.userId,
    });

    return this.jobProfileRepository.save(jobProfile);
  }

  // Get all job profiles with multi-tenancy
  async findAll(user: any) {
    const whereClause: any = {};

    // ADMIN sees all, others see only their client's profiles
    if (user.role !== UserRole.ADMIN) {
      whereClause.client_id = user.clientId;
    }

    // Exclude deleted profiles
    whereClause.status = In(['Draft', 'Active', 'Archived']);

    return this.jobProfileRepository.find({
      where: whereClause,
      relations: ['competencies', 'competencies.competency'],
    });
  }

  // Get single job profile
  async findOne(id: number, user: any) {
    const jobProfile = await this.jobProfileRepository.findOne({
      where: { job_profile_id: id },
      relations: [
        'competencies',
        'competencies.competency',
        'competencies.competency.competencyType',
        'competencies.competency.competencyCluster',
        'skills',
        'deliverables',
        'requirements',
      ],
    });

    if (!jobProfile) {
      throw new NotFoundException(`Job Profile with ID ${id} not found`);
    }

    // Check access
    if (
      user.role !== UserRole.ADMIN &&
      jobProfile.client_id !== user.clientId
    ) {
      throw new ForbiddenException('Access denied to this job profile');
    }

    return jobProfile;
  }

  // Update job profile
  async update(id: number, dto: UpdateJobProfileDto, user: any) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can update job profiles',
      );
    }

    const jobProfile = await this.findOne(id, user);

    // OFFICE_MANAGER can only update their own client's profiles
    if (
      user.role === UserRole.OFFICE_MANAGER &&
      jobProfile.client_id !== user.clientId
    ) {
      throw new ForbiddenException(
        'You can only update your own client job profiles',
      );
    }

    await this.jobProfileRepository.update(id, dto);
    return this.findOne(id, user);
  }

  // Soft delete job profile
  async remove(id: number, user: any) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.OFFICE_MANAGER) {
      throw new ForbiddenException(
        'Only ADMIN and OFFICE_MANAGER can delete job profiles',
      );
    }

    const jobProfile = await this.findOne(id, user);

    if (
      user.role === UserRole.OFFICE_MANAGER &&
      jobProfile.client_id !== user.clientId
    ) {
      throw new ForbiddenException(
        'You can only delete your own client job profiles',
      );
    }

    await this.jobProfileRepository.update(id, { status: 'Deleted' });
    return { message: 'Job Profile deleted successfully' };
  }

  // Add competency to job profile
  async addCompetency(jobProfileId: number, dto: AddCompetencyDto, user: any) {
    const jobProfile = await this.findOne(jobProfileId, user);

    // Check if competency already exists
    const existing = await this.jobProfileCompetencyRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        competency_id: dto.competency_id,
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'Competency already added to this job profile',
      );
    }

    const competency = this.jobProfileCompetencyRepository.create({
      job_profile_id: jobProfileId,
      ...dto,
    });

    return this.jobProfileCompetencyRepository.save(competency);
  }

  // Remove competency from job profile
  async removeCompetency(
    jobProfileId: number,
    competencyId: number,
    user: any,
  ) {
    await this.findOne(jobProfileId, user); // Ensure access

    const competency = await this.jobProfileCompetencyRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        competency_id: competencyId,
      },
    });

    if (!competency) {
      throw new NotFoundException('Competency not found in this job profile');
    }

    await this.jobProfileCompetencyRepository.delete(
      competency.job_profile_competency_id,
    );
    return { message: 'Competency removed from job profile successfully' };
  }

  // Add skill to job profile
  async addSkill(jobProfileId: number, dto: AddSkillDto, user: any) {
    await this.findOne(jobProfileId, user);

    const skill = this.jobProfileSkillRepository.create({
      job_profile_id: jobProfileId,
      ...dto,
    });

    return this.jobProfileSkillRepository.save(skill);
  }

  // Remove skill from job profile
  async removeSkill(jobProfileId: number, skillId: number, user: any) {
    await this.findOne(jobProfileId, user);

    const skill = await this.jobProfileSkillRepository.findOne({
      where: { job_profile_skill_id: skillId, job_profile_id: jobProfileId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found in this job profile');
    }

    await this.jobProfileSkillRepository.delete(skillId);
    return { message: 'Skill removed from job profile successfully' };
  }

  // Add deliverable to job profile
  async addDeliverable(
    jobProfileId: number,
    dto: AddDeliverableDto,
    user: any,
  ) {
    await this.findOne(jobProfileId, user);

    const deliverable = this.jobProfileDeliverableRepository.create({
      job_profile_id: jobProfileId,
      ...dto,
    });

    return this.jobProfileDeliverableRepository.save(deliverable);
  }

  // Remove deliverable from job profile
  async removeDeliverable(
    jobProfileId: number,
    deliverableId: number,
    user: any,
  ) {
    await this.findOne(jobProfileId, user);

    const deliverable = await this.jobProfileDeliverableRepository.findOne({
      where: {
        job_profile_deliverable_id: deliverableId,
        job_profile_id: jobProfileId,
      },
    });

    if (!deliverable) {
      throw new NotFoundException('Deliverable not found in this job profile');
    }

    await this.jobProfileDeliverableRepository.delete(deliverableId);
    return { message: 'Deliverable removed from job profile successfully' };
  }

  // Update job profile requirements
  async updateRequirements(
    jobProfileId: number,
    dto: UpdateRequirementsDto,
    user: any,
  ) {
    await this.findOne(jobProfileId, user);

    // Check if requirements exist
    let requirements = await this.jobProfileRequirementRepository.findOne({
      where: { job_profile_id: jobProfileId },
    });

    if (!requirements) {
      // Create new requirements
      requirements = this.jobProfileRequirementRepository.create({
        job_profile_id: jobProfileId,
        ...dto,
      });
    } else {
      // Update existing requirements
      Object.assign(requirements, dto);
    }

    return this.jobProfileRequirementRepository.save(requirements);
  }
}

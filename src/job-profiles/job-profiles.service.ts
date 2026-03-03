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
import { JpCompetencyType } from './entities/jp-competency-type.entity';
import { JpCompetencyCluster } from './entities/jp-competency-cluster.entity';
import { JpCompetency } from './entities/jp-competency.entity';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';
import { AddCompetencyDto } from './dto/add-competency.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { AddDeliverableDto } from './dto/add-deliverable.dto';
import { UpdateRequirementsDto } from './dto/update-requirements.dto';
import { CreateJpCompetencyTypeDto } from './dto/jp-competency-type/create-jp-competency-type.dto';
import { UpdateJpCompetencyTypeDto } from './dto/jp-competency-type/update-jp-competency-type.dto';
import { CreateJpCompetencyClusterDto } from './dto/jp-competency-cluster/create-jp-competency-cluster.dto';
import { UpdateJpCompetencyClusterDto } from './dto/jp-competency-cluster/update-jp-competency-cluster.dto';
import { CreateJpCompetencyDto } from './dto/jp-competency/create-jp-competency.dto';
import { UpdateJpCompetencyDto } from './dto/jp-competency/update-jp-competency.dto';
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
    @InjectRepository(JpCompetencyType)
    private readonly jpTypeRepository: Repository<JpCompetencyType>,
    @InjectRepository(JpCompetencyCluster)
    private readonly jpClusterRepository: Repository<JpCompetencyCluster>,
    @InjectRepository(JpCompetency)
    private readonly jpCompetencyRepository: Repository<JpCompetency>,
  ) {}

  // ─── Job Profile CRUD ───────────────────────────────────────────

  // Create job profile
  async create(dto: CreateJobProfileDto, user: any) {
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

    if (user.role !== UserRole.ADMIN) {
      whereClause.client_id = user.clientId;
    }

    whereClause.status = In(['Draft', 'Active', 'Archived']);

    return this.jobProfileRepository.find({
      where: whereClause,
      relations: ['competencies', 'competencies.jpCompetency'],
    });
  }

  // Get single job profile
  async findOne(id: number, user: any) {
    const jobProfile = await this.jobProfileRepository.findOne({
      where: { job_profile_id: id },
      relations: [
        'competencies',
        'competencies.jpCompetency',
        'competencies.jpCompetency.competencyType',
        'competencies.jpCompetency.competencyCluster',
        'skills',
        'deliverables',
        'requirements',
      ],
    });

    if (!jobProfile) {
      throw new NotFoundException(`Job Profile with ID ${id} not found`);
    }

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

  // ─── Job Profile ↔ Competency linking ───────────────────────────

  // Add competency to job profile
  async addCompetency(jobProfileId: number, dto: AddCompetencyDto, user: any) {
    await this.findOne(jobProfileId, user);

    // Check if competency already exists
    const existing = await this.jobProfileCompetencyRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        jp_competency_id: dto.jp_competency_id,
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
    await this.findOne(jobProfileId, user);

    const competency = await this.jobProfileCompetencyRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        jp_competency_id: competencyId,
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

  // ─── Skills ─────────────────────────────────────────────────────

  async addSkill(jobProfileId: number, dto: AddSkillDto, user: any) {
    await this.findOne(jobProfileId, user);

    const skill = this.jobProfileSkillRepository.create({
      job_profile_id: jobProfileId,
      ...dto,
    });

    return this.jobProfileSkillRepository.save(skill);
  }

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

  // ─── Deliverables ───────────────────────────────────────────────

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

  // ─── Requirements ──────────────────────────────────────────────

  async updateRequirements(
    jobProfileId: number,
    dto: UpdateRequirementsDto,
    user: any,
  ) {
    await this.findOne(jobProfileId, user);

    let requirements = await this.jobProfileRequirementRepository.findOne({
      where: { job_profile_id: jobProfileId },
    });

    if (!requirements) {
      requirements = this.jobProfileRequirementRepository.create({
        job_profile_id: jobProfileId,
        ...dto,
      });
    } else {
      Object.assign(requirements, dto);
    }

    return this.jobProfileRequirementRepository.save(requirements);
  }

  // ═══════════════════════════════════════════════════════════════
  //  JP Competency Types CRUD
  // ═══════════════════════════════════════════════════════════════

  async createJpType(dto: CreateJpCompetencyTypeDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can create JP competency types');
    }
    const type = this.jpTypeRepository.create({
      ...dto,
      client_id: user.clientId || 1,
    });
    return this.jpTypeRepository.save(type);
  }

  async findAllJpTypes() {
    return this.jpTypeRepository.find({ where: { status: 'Active' } });
  }

  async findOneJpType(id: number) {
    const type = await this.jpTypeRepository.findOne({
      where: { jp_competency_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`JP CompetencyType with ID ${id} not found`);
    }
    return type;
  }

  async updateJpType(id: number, dto: UpdateJpCompetencyTypeDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can update JP competency types');
    }
    await this.findOneJpType(id);
    await this.jpTypeRepository.update(id, dto);
    return this.findOneJpType(id);
  }

  async removeJpType(id: number, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can delete JP competency types');
    }
    await this.findOneJpType(id);
    await this.jpTypeRepository.update(id, { status: 'Deleted' });
    return { message: 'JP CompetencyType deleted successfully' };
  }

  // ═══════════════════════════════════════════════════════════════
  //  JP Competency Clusters CRUD
  // ═══════════════════════════════════════════════════════════════

  async createJpCluster(dto: CreateJpCompetencyClusterDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only ADMIN can create JP competency clusters',
      );
    }
    const cluster = this.jpClusterRepository.create({
      ...dto,
      client_id: user.clientId || 1,
    });
    return this.jpClusterRepository.save(cluster);
  }

  async findAllJpClusters() {
    return this.jpClusterRepository.find({
      where: { status: 'Active' },
      relations: ['competencyType'],
    });
  }

  async findOneJpCluster(id: number) {
    const cluster = await this.jpClusterRepository.findOne({
      where: { jp_competency_cluster_id: id },
      relations: ['competencyType'],
    });
    if (!cluster) {
      throw new NotFoundException(
        `JP CompetencyCluster with ID ${id} not found`,
      );
    }
    return cluster;
  }

  async updateJpCluster(
    id: number,
    dto: UpdateJpCompetencyClusterDto,
    user: any,
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only ADMIN can update JP competency clusters',
      );
    }
    await this.findOneJpCluster(id);
    await this.jpClusterRepository.update(id, dto);
    return this.findOneJpCluster(id);
  }

  async removeJpCluster(id: number, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only ADMIN can delete JP competency clusters',
      );
    }
    await this.findOneJpCluster(id);
    await this.jpClusterRepository.update(id, { status: 'Deleted' });
    return { message: 'JP CompetencyCluster deleted successfully' };
  }

  // ═══════════════════════════════════════════════════════════════
  //  JP Competencies CRUD
  // ═══════════════════════════════════════════════════════════════

  async createJpCompetency(dto: CreateJpCompetencyDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can create JP competencies');
    }
    const competency = this.jpCompetencyRepository.create({
      ...dto,
      client_id: user.clientId || 1,
    });
    return this.jpCompetencyRepository.save(competency);
  }

  async findAllJpCompetencies(user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.jpCompetencyRepository.find({
        relations: ['competencyType', 'competencyCluster'],
        where: { status: 'Active' },
      });
    }

    return this.jpCompetencyRepository.find({
      relations: ['competencyType', 'competencyCluster'],
      where: { status: 'Active' },
    });
  }

  async findOneJpCompetency(id: number) {
    const competency = await this.jpCompetencyRepository.findOne({
      where: { jp_competency_id: id },
      relations: ['competencyType', 'competencyCluster'],
    });
    if (!competency) {
      throw new NotFoundException(`JP Competency with ID ${id} not found`);
    }
    return competency;
  }

  async updateJpCompetency(id: number, dto: UpdateJpCompetencyDto, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can update JP competencies');
    }
    await this.findOneJpCompetency(id);
    await this.jpCompetencyRepository.update(id, dto);
    return this.findOneJpCompetency(id);
  }

  async removeJpCompetency(id: number, user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can delete JP competencies');
    }
    await this.findOneJpCompetency(id);
    await this.jpCompetencyRepository.update(id, { status: 'Deleted' });
    return { message: 'JP Competency deleted successfully' };
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';
import { JobProfileApprover } from './entities/job-profile-approver.entity';
import { JpCompetencyType } from './entities/jp-competency-type.entity';
import { JpCompetencyCluster } from './entities/jp-competency-cluster.entity';
import { JpCompetency } from './entities/jp-competency.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { EmailService } from '../email/email.service';
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
    @InjectRepository(JobProfileApprover)
    private readonly jobProfileApproverRepository: Repository<JobProfileApprover>,
    @InjectRepository(JpCompetencyType)
    private readonly jpTypeRepository: Repository<JpCompetencyType>,
    @InjectRepository(JpCompetencyCluster)
    private readonly jpClusterRepository: Repository<JpCompetencyCluster>,
    @InjectRepository(JpCompetency)
    private readonly jpCompetencyRepository: Repository<JpCompetency>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  // ─── Job Profile CRUD ───────────────────────────────────────────

  // Create job profile
  async create(dto: CreateJobProfileDto, user: any) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.OFFICE_REVIEWER &&
      user.role !== UserRole.OFFICE_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER, OFFICE_REVIEWER, and OFFICE_USER can create job profiles',
      );
    }

    const jobProfile = this.jobProfileRepository.create({
      ...dto,
      client_id: user.clientId,
      user_id: user.userId,
    });

    return this.jobProfileRepository.save(jobProfile);
  }

  // Get all job profiles with multi-tenancy, pagination and search
  async findAll(
    user: any,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      division?: string;
    },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (user.role !== UserRole.ADMIN) {
      whereClause.client_id = user.clientId;
    }

    // Filter by status (single status or default list)
    if (options?.status) {
      whereClause.status = options.status;
    } else {
      whereClause.status = In([
        'In Progress',
        'Awaiting Review',
        'Awaiting Approval',
        'Approved',
      ]);
    }

    // Filter by division
    if (options?.division) {
      whereClause.division = options.division;
    }

    // Filter by search (job_title)
    if (options?.search) {
      whereClause.job_title = ILike(`%${options.search}%`);
    }

    const relations = ['competencies', 'competencies.jpCompetency', 'department'];
    if (user.role === UserRole.ADMIN) {
      relations.push('client');
    }

    const [data, total] = await this.jobProfileRepository.findAndCount({
      where: whereClause,
      relations,
      skip,
      take: limit,
      order: { job_profile_id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get all distinct divisions for the current client (for filter dropdown)
  async getDivisions(user: any): Promise<string[]> {
    const query = this.jobProfileRepository
      .createQueryBuilder('jp')
      .select('DISTINCT jp.division', 'division')
      .where('jp.division IS NOT NULL')
      .andWhere('jp.division != :empty', { empty: '' });

    if (user.role !== UserRole.ADMIN) {
      query.andWhere('jp.client_id = :clientId', { clientId: user.clientId });
    }

    const results = await query.getRawMany();
    return results.map((r) => r.division).sort();
  }

  // Get lightweight job profile options for dropdowns (Reports To, etc.)
  async getDropdownOptions(user: any): Promise<{ value: number; label: string }[]> {
    const query = this.jobProfileRepository
      .createQueryBuilder('jp')
      .select(['jp.job_profile_id', 'jp.job_title'])
      .where('jp.status != :deleted', { deleted: 'Deleted' });

    if (user.role !== UserRole.ADMIN) {
      query.andWhere('jp.client_id = :clientId', { clientId: user.clientId });
    }

    const profiles = await query.orderBy('jp.job_title', 'ASC').getMany();
    return profiles.map((p) => ({
      value: p.job_profile_id,
      label: p.job_title,
    }));
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
        'skills.skill',
        'deliverables',
        'requirements',
        'reviewer',
        'approvers',
        'approvers.approver',
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

    // Strip sensitive fields from approver user data, keep signature
    if (jobProfile.approvers) {
      jobProfile.approvers = jobProfile.approvers.map((a) => {
        if (a.approver) {
          const { password, resetToken, resetTokenExpiry, ...safeUser } =
            a.approver as any;
          a.approver = safeUser;
        }
        return a;
      });
    }

    return jobProfile;
  }

  // Update job profile
  async update(id: number, dto: UpdateJobProfileDto, user: any) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.OFFICE_MANAGER &&
      user.role !== UserRole.OFFICE_REVIEWER &&
      user.role !== UserRole.OFFICE_USER
    ) {
      throw new ForbiddenException(
        'Only ADMIN, OFFICE_MANAGER, OFFICE_REVIEWER, and OFFICE_USER can update job profiles',
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

  // ─── Two-step Review → Approval workflow ──────────────────────

  /** Get candidate users for reviewer or approver selection */
  async getCandidates(user: any, type: 'reviewer' | 'approver' = 'approver') {
    const where: any = {
      role: type === 'reviewer' ? UserRole.OFFICE_REVIEWER : UserRole.OFFICE_MANAGER,
      status: UserStatus.ACTIVE,
    };
    if (user.role !== UserRole.ADMIN) {
      where.clientId = user.clientId;
    }
    const users = await this.userRepository.find({ where });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      email: u.email,
      role: u.role,
    }));
  }

  /**
   * Submit for review — assigns both reviewer (OFFICE_REVIEWER) and approver (OFFICE_MANAGER) upfront.
   * Status goes to 'Awaiting Review'. Reviewer gets notified first.
   */
  async submitForReview(
    jobProfileId: number,
    reviewerId: number,
    approverId: number,
    user: any,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'In Progress') {
      throw new BadRequestException(
        'Job profile must be "In Progress" to submit for review',
      );
    }

    // Validate reviewer
    const reviewer = await this.userRepository.findOne({ where: { id: reviewerId } });
    if (!reviewer) throw new NotFoundException('Reviewer user not found');
    if (reviewer.role !== UserRole.OFFICE_REVIEWER) {
      throw new BadRequestException('Reviewer must be an OFFICE_REVIEWER');
    }

    // Validate approver
    const approver = await this.userRepository.findOne({ where: { id: approverId } });
    if (!approver) throw new NotFoundException('Approver user not found');
    if (approver.role !== UserRole.OFFICE_MANAGER) {
      throw new BadRequestException('Approver must be an OFFICE_MANAGER');
    }

    // Remove any existing records
    await this.jobProfileApproverRepository.delete({ job_profile_id: jobProfileId });

    // Create reviewer record
    const reviewerRecord = this.jobProfileApproverRepository.create({
      job_profile_id: jobProfileId,
      approver_id: reviewerId,
      type: 'reviewer',
      status: 'Pending',
    });

    // Create approver record
    const approverRecord = this.jobProfileApproverRepository.create({
      job_profile_id: jobProfileId,
      approver_id: approverId,
      type: 'approver',
      status: 'Pending',
    });

    await this.jobProfileApproverRepository.save([reviewerRecord, approverRecord]);

    // Update JP status (use update() to avoid TypeORM cascading stale approvers)
    await this.jobProfileRepository.update(jobProfileId, {
      status: 'Awaiting Review',
      reviewer_id: reviewerId,
      reviewed_at: null as any,
    });

    // Notify the reviewer
    await this.notificationsService.create({
      user_id: reviewerId,
      type: NotificationType.JOB_PROFILE_APPROVAL,
      title: 'Job Profile Review Required',
      message: `You have been assigned to review the job profile "${jp.job_title}". Please review and approve or reject it.`,
      reference_type: 'job_profile',
      reference_id: jobProfileId,
      client_id: jp.client_id,
    });

    await this.emailService.sendReviewerAssignmentEmail(
      reviewer.email,
      reviewer.name,
      jp.job_title,
      jobProfileId,
    );

    return this.findOne(jobProfileId, user);
  }

  /** Reviewer (OFFICE_REVIEWER) approves or rejects at the 'Awaiting Review' stage */
  async reviewerAction(
    jobProfileId: number,
    action: 'approve' | 'reject',
    user: any,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'Awaiting Review') {
      throw new BadRequestException(
        'Job profile is not in "Awaiting Review" status',
      );
    }

    // Find this user's reviewer record
    const reviewerRecord = await this.jobProfileApproverRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        approver_id: user.userId,
        type: 'reviewer',
      },
    });

    if (!reviewerRecord) {
      throw new ForbiddenException(
        'You are not assigned as the reviewer for this job profile',
      );
    }

    if (reviewerRecord.status !== 'Pending') {
      throw new BadRequestException('You have already reviewed this job profile');
    }

    reviewerRecord.status = action === 'approve' ? 'Approved' : 'Rejected';
    reviewerRecord.approved_at = new Date();
    await this.jobProfileApproverRepository.save(reviewerRecord);

    const creatorId = Number(jp.user_id);

    if (action === 'reject') {
      jp.status = 'In Progress';
      jp.reviewed_at = new Date();
      await this.jobProfileRepository.save(jp);

      if (creatorId) {
        await this.notificationsService.create({
          user_id: creatorId,
          type: NotificationType.JOB_PROFILE_APPROVAL,
          title: 'Job Profile Requires Changes',
          message: `Your job profile "${jp.job_title}" was rejected by reviewer ${user.name || ''} and has been returned to In Progress.`,
          reference_type: 'job_profile',
          reference_id: jobProfileId,
          client_id: jp.client_id,
        });
      }
    } else {
      // Reviewer approved → move to 'Awaiting Approval', notify the approver
      jp.status = 'Awaiting Approval';
      jp.reviewed_at = new Date();
      await this.jobProfileRepository.save(jp);

      // Find the approver record and notify them
      const approverRecord = await this.jobProfileApproverRepository.findOne({
        where: { job_profile_id: jobProfileId, type: 'approver' },
        relations: ['approver'],
      });

      if (approverRecord) {
        await this.notificationsService.create({
          user_id: approverRecord.approver_id,
          type: NotificationType.JOB_PROFILE_APPROVAL,
          title: 'Job Profile Approval Required',
          message: `The job profile "${jp.job_title}" has been reviewed and is now awaiting your approval.`,
          reference_type: 'job_profile',
          reference_id: jobProfileId,
          client_id: jp.client_id,
        });

        if (approverRecord.approver) {
          await this.emailService.sendReviewerAssignmentEmail(
            approverRecord.approver.email,
            approverRecord.approver.name,
            jp.job_title,
            jobProfileId,
          );
        }
      }

      if (creatorId) {
        await this.notificationsService.create({
          user_id: creatorId,
          type: NotificationType.JOB_PROFILE_APPROVAL,
          title: 'Job Profile Reviewed',
          message: `Your job profile "${jp.job_title}" has been reviewed and is now awaiting final approval.`,
          reference_type: 'job_profile',
          reference_id: jobProfileId,
          client_id: jp.client_id,
        });
      }
    }

    return this.findOne(jobProfileId, user);
  }

  /** Approver (OFFICE_MANAGER) approves or rejects at the 'Awaiting Approval' stage */
  async approverAction(
    jobProfileId: number,
    action: 'approve' | 'reject',
    user: any,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'Awaiting Approval') {
      throw new BadRequestException(
        'Job profile is not in "Awaiting Approval" status',
      );
    }

    // Find this user's approver record
    const approverRecord = await this.jobProfileApproverRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        approver_id: user.userId,
        type: 'approver',
      },
    });

    if (!approverRecord) {
      throw new ForbiddenException(
        'You are not assigned as the approver for this job profile',
      );
    }

    if (approverRecord.status !== 'Pending') {
      throw new BadRequestException('You have already acted on this job profile');
    }

    approverRecord.status = action === 'approve' ? 'Approved' : 'Rejected';
    approverRecord.approved_at = new Date();
    await this.jobProfileApproverRepository.save(approverRecord);

    const creatorId = Number(jp.user_id);

    if (action === 'reject') {
      jp.status = 'In Progress';
      jp.reviewed_at = new Date();
      await this.jobProfileRepository.save(jp);

      if (creatorId) {
        await this.notificationsService.create({
          user_id: creatorId,
          type: NotificationType.JOB_PROFILE_APPROVAL,
          title: 'Job Profile Requires Changes',
          message: `Your job profile "${jp.job_title}" was rejected by ${user.name || 'the approver'} and has been returned to In Progress.`,
          reference_type: 'job_profile',
          reference_id: jobProfileId,
          client_id: jp.client_id,
        });
      }
    } else {
      jp.status = 'Approved';
      jp.reviewed_at = new Date();
      await this.jobProfileRepository.save(jp);

      if (creatorId) {
        await this.notificationsService.create({
          user_id: creatorId,
          type: NotificationType.JOB_PROFILE_APPROVAL,
          title: 'Job Profile Approved',
          message: `Your job profile "${jp.job_title}" has been fully approved.`,
          reference_type: 'job_profile',
          reference_id: jobProfileId,
          client_id: jp.client_id,
        });
      }
    }

    return this.findOne(jobProfileId, user);
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

  // Update competency link on a job profile
  async updateCompetency(
    jobProfileId: number,
    competencyId: number,
    data: { level?: number; is_critical?: boolean; is_differentiating?: boolean },
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

    if (data.level !== undefined) competency.level = data.level;
    if (data.is_critical !== undefined) competency.is_critical = data.is_critical;
    if (data.is_differentiating !== undefined)
      competency.is_differentiating = data.is_differentiating;

    return this.jobProfileCompetencyRepository.save(competency);
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

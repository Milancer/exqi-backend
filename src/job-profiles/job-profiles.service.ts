import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';
import { JobProfileApprover } from './entities/job-profile-approver.entity';
import {
  JobProfileAuditLog,
  AuditEventType,
} from './entities/job-profile-audit-log.entity';
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
    @InjectRepository(JobProfileAuditLog)
    private readonly auditLogRepository: Repository<JobProfileAuditLog>,
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

    // OFFICE_REVIEWER and (when not also creator) OFFICE_MANAGER acting as approver
    // can only see job profiles where they are an assigned reviewer/approver.
    if (user.role === UserRole.OFFICE_REVIEWER) {
      const assigned = await this.jobProfileApproverRepository.find({
        where: { approver_id: user.userId },
        select: ['job_profile_id'],
      });
      const ids = assigned.map((a) => a.job_profile_id);
      // If they have no assignments, return an empty page early.
      if (ids.length === 0) {
        return { data: [], total: 0, page, limit, totalPages: 0 };
      }
      whereClause.job_profile_id = In(ids);
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

    const relations = [
      'competencies',
      'competencies.jpCompetency',
      'department',
    ];
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
  async getDropdownOptions(
    user: any,
  ): Promise<{ value: number; label: string }[]> {
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

    // OFFICE_REVIEWER can only access profiles where they are an assigned reviewer/approver
    if (user.role === UserRole.OFFICE_REVIEWER) {
      const isAssigned = (jobProfile.approvers || []).some(
        (a) => a.approver_id === user.userId,
      );
      if (!isAssigned) {
        throw new ForbiddenException('Access denied to this job profile');
      }
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

    // Compute diff against the existing profile before applying the update
    const changes = this.diffRecords(jobProfile as any, dto as any, [
      'updated_at',
      'created_at',
      'job_profile_id',
      'status',
      'reviewer_id',
      'reviewed_at',
    ]);

    await this.jobProfileRepository.update(id, dto);

    if (changes.length > 0) {
      await this.recordEditAndMaybeRevert({
        jobProfileId: id,
        user,
        summary: `Job profile fields updated: ${changes.map((c) => c.field).join(', ')}`,
        changes,
      });
    }

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
      role:
        type === 'reviewer'
          ? UserRole.OFFICE_REVIEWER
          : UserRole.OFFICE_MANAGER,
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
   * Find an existing user by email or create a new invited user with the given role.
   * Returns the user and an optional resetToken (only set when a new user was created).
   */
  private async findOrInviteUser(
    email: string,
    role: UserRole,
    clientId: number,
  ): Promise<{ user: User; resetToken?: string; created: boolean }> {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Invalid email address');
    }
    const normalisedEmail = email.trim().toLowerCase();

    const existing = await this.userRepository.findOne({
      where: { email: ILike(normalisedEmail) },
    });
    if (existing) {
      return { user: existing, created: false };
    }

    const tempPassword = crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 72); // 3 days for reviewer invites

    const newUser = this.userRepository.create({
      name: normalisedEmail.split('@')[0],
      surname: '',
      idNumber: '',
      phoneNumber: '',
      email: normalisedEmail,
      password: hashedPassword,
      role,
      status: UserStatus.ACTIVE,
      clientId,
      resetToken,
      resetTokenExpiry,
    });
    const saved = await this.userRepository.save(newUser);
    return { user: saved, resetToken, created: true };
  }

  /**
   * Submit for review — assigns both reviewer (OFFICE_REVIEWER) and approver (OFFICE_MANAGER) upfront.
   * Either an existing user ID OR an email address can be provided. If an email is given for someone
   * who isn't yet a user, they are auto-created and emailed an invite link to set their password.
   * Status goes to 'Awaiting Review'. Reviewer gets notified first.
   */
  async submitForReview(
    jobProfileId: number,
    body: {
      reviewer_id?: number;
      reviewer_email?: string;
      approver_id?: number;
      approver_email?: string;
    },
    user: any,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'In Progress') {
      throw new BadRequestException(
        'Job profile must be "In Progress" to submit for review',
      );
    }

    // Resolve reviewer (existing user by ID, or find/invite by email)
    let reviewer: User;
    let reviewerResetToken: string | undefined;
    let reviewerWasCreated = false;
    if (body.reviewer_id) {
      const found = await this.userRepository.findOne({
        where: { id: body.reviewer_id },
      });
      if (!found) throw new NotFoundException('Reviewer user not found');
      if (found.role !== UserRole.OFFICE_REVIEWER) {
        throw new BadRequestException('Reviewer must be an OFFICE_REVIEWER');
      }
      reviewer = found;
    } else if (body.reviewer_email) {
      const result = await this.findOrInviteUser(
        body.reviewer_email,
        UserRole.OFFICE_REVIEWER,
        jp.client_id,
      );
      reviewer = result.user;
      reviewerResetToken = result.resetToken;
      reviewerWasCreated = result.created;
    } else {
      throw new BadRequestException(
        'reviewer_id or reviewer_email is required',
      );
    }

    // Resolve approver (existing user by ID, or find/invite by email)
    let approver: User;
    let approverResetToken: string | undefined;
    let approverWasCreated = false;
    if (body.approver_id) {
      const found = await this.userRepository.findOne({
        where: { id: body.approver_id },
      });
      if (!found) throw new NotFoundException('Approver user not found');
      if (found.role !== UserRole.OFFICE_MANAGER) {
        throw new BadRequestException('Approver must be an OFFICE_MANAGER');
      }
      approver = found;
    } else if (body.approver_email) {
      const result = await this.findOrInviteUser(
        body.approver_email,
        UserRole.OFFICE_MANAGER,
        jp.client_id,
      );
      approver = result.user;
      approverResetToken = result.resetToken;
      approverWasCreated = result.created;
    } else {
      throw new BadRequestException(
        'approver_id or approver_email is required',
      );
    }

    // Preserve history across re-submissions: instead of deleting prior
    // reviewer/approver rows, compute the next round number and append new
    // rows. The Review & Approval Status Table on the frontend groups rows
    // by round so all prior approvals remain visible for audit purposes.
    const latest = await this.jobProfileApproverRepository.findOne({
      where: { job_profile_id: jobProfileId },
      order: { round_number: 'DESC' },
    });
    const nextRound = (latest?.round_number ?? 0) + 1;

    // Create reviewer record for this round
    const reviewerRecord = this.jobProfileApproverRepository.create({
      job_profile_id: jobProfileId,
      approver_id: reviewer.id,
      type: 'reviewer',
      status: 'Pending',
      round_number: nextRound,
    });

    // Create approver record for this round
    const approverRecord = this.jobProfileApproverRepository.create({
      job_profile_id: jobProfileId,
      approver_id: approver.id,
      type: 'approver',
      status: 'Pending',
      round_number: nextRound,
    });

    await this.jobProfileApproverRepository.save([
      reviewerRecord,
      approverRecord,
    ]);

    // Update JP status (use update() to avoid TypeORM cascading stale approvers)
    await this.jobProfileRepository.update(jobProfileId, {
      status: 'Awaiting Review',
      reviewer_id: reviewer.id,
      reviewed_at: null as any,
    });

    // Notify the reviewer
    await this.notificationsService.create({
      user_id: reviewer.id,
      type: NotificationType.JOB_PROFILE_APPROVAL,
      title: 'Job Profile Review Required',
      message: `You have been assigned to review the job profile "${jp.job_title}". Please review and approve or reject it.`,
      reference_type: 'job_profile',
      reference_id: jobProfileId,
      client_id: jp.client_id,
    });

    // For newly invited users, send the welcome/invite email with reset token + redirect to job profile.
    // For existing users, send the standard reviewer assignment email.
    if (reviewerWasCreated && reviewerResetToken) {
      await this.emailService.sendReviewerInviteEmail(
        reviewer.email,
        jp.job_title,
        jobProfileId,
        reviewerResetToken,
      );
    } else {
      await this.emailService.sendReviewerAssignmentEmail(
        reviewer.email,
        reviewer.name,
        jp.job_title,
        jobProfileId,
      );
    }

    // Note: the approver is intentionally NOT emailed here. They are contacted
    // only after the reviewer approves (see reviewerAction below). This keeps
    // the review → approval sequence strictly ordered so that a newly-invited
    // approver cannot act on the profile before the reviewer has reviewed it.
    // `approverWasCreated` / `approverResetToken` are no longer consumed at
    // submit time — a fresh reset token is issued in reviewerAction if the
    // approver still hasn't set their password by then.
    void approverWasCreated;
    void approverResetToken;

    await this.logAuditEvent({
      jobProfileId,
      userId: user.userId,
      eventType: 'submitted_for_review',
      summary: `Submitted for review. Reviewer: ${reviewer.email}, Approver: ${approver.email}`,
    });

    return this.findOne(jobProfileId, user);
  }

  /** Reviewer (OFFICE_REVIEWER) approves or rejects at the 'Awaiting Review' stage */
  async reviewerAction(
    jobProfileId: number,
    action: 'approve' | 'reject',
    user: any,
    comment?: string,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'Awaiting Review') {
      throw new BadRequestException(
        'Job profile is not in "Awaiting Review" status',
      );
    }

    // Only the current (latest) round is actionable — historical rows from
    // prior re-submissions are kept for audit but must not be touched here.
    const currentRound = Math.max(
      1,
      ...(jp.approvers || []).map((a) => a.round_number ?? 1),
    );

    // Find this user's reviewer record for the current round
    const reviewerRecord = await this.jobProfileApproverRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        approver_id: user.userId,
        type: 'reviewer',
        round_number: currentRound,
      },
    });

    if (!reviewerRecord) {
      throw new ForbiddenException(
        'You are not assigned as the reviewer for this job profile',
      );
    }

    if (reviewerRecord.status !== 'Pending') {
      throw new BadRequestException(
        'You have already reviewed this job profile',
      );
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

      // Find the approver record for the current round and notify them
      const approverRecord = await this.jobProfileApproverRepository.findOne({
        where: {
          job_profile_id: jobProfileId,
          type: 'approver',
          round_number: currentRound,
        },
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
          // If the approver was invited by email at submit time and still
          // hasn't completed account setup, they won't have a usable password
          // — send them the invite-with-setup email so they can set a
          // password and land on the profile. Regenerate a fresh reset token
          // (never reuse the old one: it may be expired, and one-time-use
          // tokens shouldn't be reissued verbatim).
          const approverUser = await this.userRepository.findOne({
            where: { id: approverRecord.approver_id },
          });
          const needsInvite = !!approverUser?.resetToken;

          if (needsInvite && approverUser) {
            const freshToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 72);
            await this.userRepository.update(approverUser.id, {
              resetToken: freshToken,
              resetTokenExpiry,
            });
            await this.emailService.sendReviewerInviteEmail(
              approverUser.email,
              jp.job_title,
              jobProfileId,
              freshToken,
            );
          } else {
            await this.emailService.sendReviewerAssignmentEmail(
              approverRecord.approver.email,
              approverRecord.approver.name,
              jp.job_title,
              jobProfileId,
            );
          }
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

    await this.logAuditEvent({
      jobProfileId,
      userId: user.userId,
      eventType:
        action === 'approve' ? 'reviewer_approved' : 'reviewer_rejected',
      summary:
        action === 'approve'
          ? 'Reviewer approved the job profile'
          : 'Reviewer rejected the job profile',
      comment: comment || undefined,
    });

    return this.findOne(jobProfileId, user);
  }

  /** Approver (OFFICE_MANAGER) approves or rejects at the 'Awaiting Approval' stage */
  async approverAction(
    jobProfileId: number,
    action: 'approve' | 'reject',
    user: any,
    comment?: string,
  ) {
    const jp = await this.findOne(jobProfileId, user);

    if (jp.status !== 'Awaiting Approval') {
      throw new BadRequestException(
        'Job profile is not in "Awaiting Approval" status',
      );
    }

    // Only the current (latest) round is actionable — historical rows from
    // prior re-submissions are kept for audit but must not be touched here.
    const currentRound = Math.max(
      1,
      ...(jp.approvers || []).map((a) => a.round_number ?? 1),
    );

    // Find this user's approver record for the current round
    const approverRecord = await this.jobProfileApproverRepository.findOne({
      where: {
        job_profile_id: jobProfileId,
        approver_id: user.userId,
        type: 'approver',
        round_number: currentRound,
      },
    });

    if (!approverRecord) {
      throw new ForbiddenException(
        'You are not assigned as the approver for this job profile',
      );
    }

    if (approverRecord.status !== 'Pending') {
      throw new BadRequestException(
        'You have already acted on this job profile',
      );
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

    await this.logAuditEvent({
      jobProfileId,
      userId: user.userId,
      eventType:
        action === 'approve' ? 'approver_approved' : 'approver_rejected',
      summary:
        action === 'approve'
          ? 'Approver approved the job profile'
          : 'Approver rejected the job profile',
      comment: comment || undefined,
    });

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

    const saved = await this.jobProfileCompetencyRepository.save(competency);
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Competency added (id ${dto.jp_competency_id}, level ${dto.level})`,
    });
    return saved;
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
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Competency removed (id ${competencyId})`,
    });
    return { message: 'Competency removed from job profile successfully' };
  }

  // Update competency link on a job profile
  async updateCompetency(
    jobProfileId: number,
    competencyId: number,
    data: {
      level?: number;
      is_critical?: boolean;
      is_differentiating?: boolean;
    },
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

    const before = {
      level: competency.level,
      is_critical: competency.is_critical,
      is_differentiating: competency.is_differentiating,
    };

    if (data.level !== undefined) competency.level = data.level;
    if (data.is_critical !== undefined)
      competency.is_critical = data.is_critical;
    if (data.is_differentiating !== undefined)
      competency.is_differentiating = data.is_differentiating;

    const saved = await this.jobProfileCompetencyRepository.save(competency);
    const changes = this.diffRecords(before as any, data as any);
    if (changes.length > 0) {
      await this.recordEditAndMaybeRevert({
        jobProfileId,
        user,
        summary: `Competency updated: ${changes.map((c) => c.field).join(', ')}`,
        changes: changes.map((c) => ({
          field: `competency#${competencyId}.${c.field}`,
          old: c.old,
          new: c.new,
        })),
      });
    }
    return saved;
  }

  // ─── Skills ─────────────────────────────────────────────────────

  async addSkill(jobProfileId: number, dto: AddSkillDto, user: any) {
    await this.findOne(jobProfileId, user);

    const skill = this.jobProfileSkillRepository.create({
      job_profile_id: jobProfileId,
      ...dto,
    });

    const saved = await this.jobProfileSkillRepository.save(skill);
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Skill added: ${(dto as any).skill_name || `(id ${(dto as any).skill_id})`} at level ${(dto as any).level}`,
    });
    return saved;
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
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Skill removed (id ${skillId})`,
    });
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

    const saved = await this.jobProfileDeliverableRepository.save(deliverable);
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Deliverable added: ${(dto as any).deliverable || ''}`.slice(
        0,
        200,
      ),
    });
    return saved;
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
    await this.recordEditAndMaybeRevert({
      jobProfileId,
      user,
      summary: `Deliverable removed (id ${deliverableId})`,
    });
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

    const before = requirements ? { ...requirements } : null;

    if (!requirements) {
      requirements = this.jobProfileRequirementRepository.create({
        job_profile_id: jobProfileId,
        ...dto,
      });
    } else {
      Object.assign(requirements, dto);
    }

    const saved = await this.jobProfileRequirementRepository.save(requirements);

    const changes = before
      ? this.diffRecords(before as any, dto as any, [
          'updated_at',
          'created_at',
          'job_profile_id',
          'job_profile_requirement_id',
        ])
      : Object.entries(dto).map(([k, v]) => ({ field: k, old: null, new: v }));

    if (changes.length > 0) {
      await this.recordEditAndMaybeRevert({
        jobProfileId,
        user,
        summary: `Requirements updated: ${changes.map((c) => c.field).join(', ')}`,
        changes,
      });
    }

    return saved;
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

  // ─── Audit log helpers ─────────────────────────────────────────────

  /** Append an entry to the audit log for a job profile. */
  private async logAuditEvent(opts: {
    jobProfileId: number;
    userId: number;
    eventType: AuditEventType;
    summary?: string;
    comment?: string;
    changes?: Array<{ field: string; old: unknown; new: unknown }> | null;
  }) {
    const entry = this.auditLogRepository.create({
      job_profile_id: opts.jobProfileId,
      user_id: opts.userId,
      event_type: opts.eventType,
      summary: opts.summary ?? null,
      comment: opts.comment ?? null,
      changes: opts.changes ?? null,
    });
    await this.auditLogRepository.save(entry);
  }

  /**
   * Compare old and new versions of a record and return only the fields that changed.
   * Skips fields listed in `ignore`.
   */
  private diffRecords<T extends Record<string, any>>(
    before: T,
    after: Partial<T>,
    ignore: string[] = ['updated_at', 'created_at'],
  ): Array<{ field: string; old: unknown; new: unknown }> {
    const changes: Array<{ field: string; old: unknown; new: unknown }> = [];
    for (const key of Object.keys(after)) {
      if (ignore.includes(key)) continue;
      const oldVal = before?.[key];
      const newVal = (after as any)[key];
      // Treat null/undefined/empty string as equivalent for non-edit detection
      const isEmpty = (v: any) => v === null || v === undefined || v === '';
      if (isEmpty(oldVal) && isEmpty(newVal)) continue;
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes.push({ field: key, old: oldVal, new: newVal });
      }
    }
    return changes;
  }

  /**
   * Called after any edit to a job profile. If the profile is currently
   * "Awaiting Review" or "Awaiting Approval", reverts it to "In Progress",
   * notifies the assigned reviewer/approver via email with the diff, and
   * logs both the edit and the auto-revert to the audit log.
   */
  private async recordEditAndMaybeRevert(opts: {
    jobProfileId: number;
    user: any;
    summary: string;
    changes?: Array<{ field: string; old: unknown; new: unknown }> | null;
  }) {
    const jp = await this.jobProfileRepository.findOne({
      where: { job_profile_id: opts.jobProfileId },
      relations: ['approvers', 'approvers.approver'],
    });
    if (!jp) return;

    // Always log the edit itself
    await this.logAuditEvent({
      jobProfileId: opts.jobProfileId,
      userId: opts.user.userId,
      eventType: 'updated',
      summary: opts.summary,
      changes: opts.changes ?? null,
    });

    // Auto-revert if the profile was awaiting action
    if (jp.status === 'Awaiting Review' || jp.status === 'Awaiting Approval') {
      const previousStatus = jp.status;
      await this.jobProfileRepository.update(opts.jobProfileId, {
        status: 'In Progress',
      });

      await this.logAuditEvent({
        jobProfileId: opts.jobProfileId,
        userId: opts.user.userId,
        eventType: 'reverted_to_in_progress',
        summary: `Status auto-reverted from ${previousStatus} to In Progress because the profile was edited.`,
      });

      // NOTE: Historical approver rows (from this or prior rounds) are now
      // immutable audit records — we no longer reset them to Pending here.
      // The next call to submitForReview appends a fresh round with Pending
      // rows of its own, so no reset is required.

      // Email only the CURRENT round's reviewer/approver — historical rows
      // from previous rounds should not be re-emailed every time the profile
      // is edited.
      const editorName =
        opts.user.name || opts.user.email || `User #${opts.user.userId}`;
      const currentRound = Math.max(
        1,
        ...(jp.approvers || []).map((a) => a.round_number ?? 1),
      );
      const recipients = (jp.approvers || []).filter(
        (a) =>
          a.round_number === currentRound && a.approver && a.approver.email,
      );
      for (const rec of recipients) {
        try {
          await this.emailService.sendJobProfileChangedEmail(
            rec.approver.email,
            rec.approver.name || '',
            jp.job_title,
            opts.jobProfileId,
            editorName,
            opts.summary,
            opts.changes ?? null,
          );
        } catch {
          /* swallow email errors so the edit still succeeds */
        }
      }
    }
  }

  /** Public: list the audit log for a job profile (newest first). */
  async getAuditLog(jobProfileId: number, user: any) {
    // Reuse the access guard from findOne
    await this.findOne(jobProfileId, user);
    const entries = await this.auditLogRepository.find({
      where: { job_profile_id: jobProfileId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
    // Strip sensitive user fields
    return entries.map((e) => {
      if (e.user) {
        const { password, resetToken, resetTokenExpiry, ...safeUser } =
          e.user as any;
        e.user = safeUser;
      }
      return e;
    });
  }
}

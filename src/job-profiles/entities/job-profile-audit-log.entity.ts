import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';
import { User } from '../../users/entities/user.entity';

export const AUDIT_EVENT_TYPES = [
  'created',
  'updated',
  'submitted_for_review',
  'reviewer_approved',
  'reviewer_rejected',
  'approver_approved',
  'approver_rejected',
  'reverted_to_in_progress',
] as const;

export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

/**
 * One row per state-changing event on a job profile (edit, submit, approve, reject).
 * `changes` is a free-form JSON blob describing field-level diffs when applicable.
 */
@Entity('job_profile_audit_logs')
export class JobProfileAuditLog {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index()
  @Column()
  job_profile_id: number;

  @ApiProperty({ description: 'User who performed the action' })
  @Column()
  user_id: number;

  @ApiProperty({ enum: AUDIT_EVENT_TYPES })
  @Column({ type: 'enum', enum: AUDIT_EVENT_TYPES })
  event_type: AuditEventType;

  @ApiPropertyOptional({ description: 'Optional human-readable summary' })
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @ApiPropertyOptional({
    description: 'Optional comment (e.g. rejection reason)',
  })
  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @ApiPropertyOptional({
    description:
      'Field-level changes as JSON: [{ field, old, new }, ...]. Null for non-edit events.',
  })
  @Column({ type: 'jsonb', nullable: true })
  changes: Array<{ field: string; old: unknown; new: unknown }> | null;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => JobProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

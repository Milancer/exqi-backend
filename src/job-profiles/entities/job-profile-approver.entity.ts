import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';
import { User } from '../../users/entities/user.entity';

export const APPROVER_STATUSES = ['Pending', 'Approved', 'Rejected'] as const;

@Entity('job_profile_approvers')
export class JobProfileApprover {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_approver_id: number;

  @ApiProperty()
  @Column()
  job_profile_id: number;

  @ApiProperty({ description: 'User ID of the approver' })
  @Column()
  approver_id: number;

  @ApiProperty({ enum: APPROVER_STATUSES })
  @Column({
    type: 'enum',
    enum: APPROVER_STATUSES,
    default: 'Pending',
  })
  status: string;

  @ApiPropertyOptional({ description: 'When this approver took action' })
  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => JobProfile, (jp) => jp.approvers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'approver_id' })
  approver: User;
}

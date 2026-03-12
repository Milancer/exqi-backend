import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobProfileCompetency } from './job-profile-competency.entity';
import { JobProfileSkill } from './job-profile-skill.entity';
import { JobProfileDeliverable } from './job-profile-deliverable.entity';
import { JobProfileRequirement } from './job-profile-requirement.entity';
import { JobProfileApprover } from './job-profile-approver.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { JobGrade } from '../../job-grades/entities/job-grade.entity';
import { WorkLevel } from '../../work-levels/entities/work-level.entity';

export const JP_STATUSES = [
  'In Progress',
  'Awaiting Approval',
  'Approved',
  'Deleted',
] as const;

@Entity('job_profiles')
export class JobProfile {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_id: number;

  @ApiProperty()
  @Column()
  client_id: number;

  @ApiProperty()
  @Column()
  user_id: string; // Creator

  @ApiProperty({ example: 'Senior Software Engineer' })
  @Column()
  job_title: string;

  @ApiProperty({ example: 'Lead development of core platform features' })
  @Column('text')
  job_purpose: string;

  @ApiPropertyOptional({ example: 1 })
  @Column({ nullable: true })
  department_id: number;

  @ApiPropertyOptional({ example: 'Engineering' })
  @Column({ nullable: true })
  division: string;

  @ApiPropertyOptional({ example: 'Software Development' })
  @Column({ nullable: true })
  job_family: string;

  @ApiPropertyOptional({ example: 'Remote' })
  @Column({ nullable: true })
  job_location: string;

  @ApiPropertyOptional({ example: 4 })
  @Column({ nullable: true })
  level_of_work: number;

  @ApiPropertyOptional({ example: 1 })
  @Column({ nullable: true })
  job_grade_id: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Reports to another job profile ID',
  })
  @Column({ nullable: true })
  reports_to: number;

  @ApiProperty({ enum: JP_STATUSES })
  @Column({
    type: 'enum',
    enum: JP_STATUSES,
    default: 'In Progress',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Assigned reviewer (OFFICE_MANAGER) user ID',
  })
  @Column({ nullable: true })
  reviewer_id: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => Department, { nullable: true, eager: false })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => JobGrade, { nullable: true, eager: false })
  @JoinColumn({ name: 'job_grade_id' })
  jobGrade: JobGrade;

  @ManyToOne(() => WorkLevel, { nullable: true, eager: false })
  @JoinColumn({ name: 'level_of_work' })
  workLevel: WorkLevel;

  @ApiPropertyOptional({ description: 'When the review action was taken' })
  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => JobProfileCompetency, (jpc) => jpc.jobProfile)
  competencies: JobProfileCompetency[];

  @OneToMany(() => JobProfileSkill, (jps) => jps.jobProfile)
  skills: JobProfileSkill[];

  @OneToMany(() => JobProfileDeliverable, (jpd) => jpd.jobProfile)
  deliverables: JobProfileDeliverable[];

  @OneToOne(() => JobProfileRequirement, (jpr) => jpr.jobProfile)
  requirements: JobProfileRequirement;

  @OneToMany(() => JobProfileApprover, (jpa) => jpa.jobProfile)
  approvers: JobProfileApprover[];
}

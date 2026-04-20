import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';

@Entity('job_profile_deliverables')
export class JobProfileDeliverable {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_deliverable_id: number;

  @ApiProperty()
  @Column()
  job_profile_id: number;

  @ApiProperty({ example: 'Develop and maintain core platform features' })
  @Column('text')
  deliverable: string;

  @ApiProperty({ example: 1, description: 'Display order' })
  @Column({ default: 1 })
  sequence: number;

  // ─── Structured fields (aligned with old EXQI) ──────────────
  @ApiProperty({ description: 'Key Performance Area (short headline)', required: false })
  @Column('text', { nullable: true })
  kpa: string | null;

  @ApiProperty({ description: 'Key Performance Indicators (one per line)', required: false })
  @Column('text', { nullable: true })
  kpis: string | null;

  @ApiProperty({ description: 'Responsibilities (one per line)', required: false })
  @Column('text', { nullable: true })
  responsibilities: string | null;

  @ApiProperty({ description: 'Relative weight 0–100', required: false })
  @Column({ type: 'int', nullable: true })
  weight: number | null;

  @ApiProperty({ enum: ['Active', 'Inactive'] })
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive'],
    default: 'Active',
  })
  status: string;

  @ManyToOne(() => JobProfile, (jp) => jp.deliverables)
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;
}

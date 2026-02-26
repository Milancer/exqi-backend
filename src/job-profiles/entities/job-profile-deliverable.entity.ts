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

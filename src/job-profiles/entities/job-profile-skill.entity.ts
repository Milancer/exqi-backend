import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';

@Entity('job_profile_skills')
export class JobProfileSkill {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_skill_id: number;

  @ApiProperty()
  @Column()
  job_profile_id: number;

  @ApiProperty({ example: 'JavaScript' })
  @Column()
  skill_name: string;

  @ApiProperty({ example: 3, description: 'Required proficiency level (1-5)' })
  @Column()
  level: number;

  @ApiProperty({ example: true, description: 'Is this a critical skill?' })
  @Column({ default: false })
  is_critical: boolean;

  @ApiProperty({ enum: ['Active', 'Inactive'] })
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive'],
    default: 'Active',
  })
  status: string;

  @ManyToOne(() => JobProfile, (jp) => jp.skills)
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;
}

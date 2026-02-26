import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';
import { Competency } from '../../competencies/entities/competency.entity';

@Entity('job_profile_competencies')
export class JobProfileCompetency {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_competency_id: number;

  @ApiProperty()
  @Column()
  job_profile_id: number;

  @ApiProperty()
  @Column()
  competency_id: number;

  @ApiProperty({ example: 3, description: 'Required proficiency level (1-5)' })
  @Column()
  level: number;

  @ApiProperty({ example: true, description: 'Is this a critical competency?' })
  @Column({ default: false })
  is_critical: boolean;

  @ApiProperty({
    example: true,
    description: 'Is this a differentiating competency?',
  })
  @Column({ default: false })
  is_differentiating: boolean;

  @ManyToOne(() => JobProfile, (jp) => jp.competencies)
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;

  @ManyToOne(() => Competency)
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;
}

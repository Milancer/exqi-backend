import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobProfile } from './job-profile.entity';

@Entity('job_profile_requirements')
export class JobProfileRequirement {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_profile_requirement_id: number;

  @ApiProperty()
  @Column()
  job_profile_id: number;

  @ApiPropertyOptional({ example: "Bachelor's degree in Computer Science" })
  @Column('text', { nullable: true })
  education: string;

  @ApiPropertyOptional({
    example: '5+ years of software development experience',
  })
  @Column('text', { nullable: true })
  experience: string;

  @ApiPropertyOptional({ example: 'AWS Certified Solutions Architect' })
  @Column('text', { nullable: true })
  certifications: string;

  @ApiPropertyOptional({
    example: 'Strong communication and leadership skills',
  })
  @Column('text', { nullable: true })
  other_requirements: string;

  @ApiProperty({ enum: ['Active', 'Inactive'] })
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive'],
    default: 'Active',
  })
  status: string;

  @OneToOne(() => JobProfile, (jp) => jp.requirements)
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('competency_interviews')
export class CompetencyInterview {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  competency_interview_id: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  job_profile_id: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  cbi_template_id: number;

  @ApiProperty()
  @Column()
  candidate_id: number;

  @ApiProperty()
  @Column('date')
  interview_date: Date;

  @ApiPropertyOptional()
  @Column('text', { nullable: true })
  clarification_questions: string;

  @ApiProperty({ enum: ['Scheduled', 'Completed', 'Cancelled'] })
  @Column({
    type: 'enum',
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  })
  status: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

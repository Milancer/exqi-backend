import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Candidate } from '../../candidates/entities/candidate.entity';
import { CbiTemplate } from '../../cbi/entities/cbi-template.entity';
import { User } from '../../users/entities/user.entity';

export enum SessionStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
}

@Entity('interview_sessions')
export class InterviewSession {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  session_id: number;

  @ApiProperty()
  @Column()
  candidate_id: number;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ApiProperty()
  @Column()
  cbi_template_id: number;

  @ManyToOne(() => CbiTemplate)
  @JoinColumn({ name: 'cbi_template_id' })
  template: CbiTemplate;

  @ApiProperty({
    description: 'Snapshot of questions at the time of creation',
  })
  @Column('json', { nullable: true })
  questions: Array<{
    question_id: number;
    competency_id: number;
    question_text: string;
    competency_name: string;
    level: number;
  }>;

  @ApiProperty({ description: 'Office Manager assigned as interviewer' })
  @Column()
  interviewer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'interviewer_id' })
  interviewer: User;

  @ApiProperty({ description: 'Unique token for the shareable interview link' })
  @Column({ unique: true })
  token: string;

  @ApiProperty({ enum: SessionStatus })
  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

  @ApiProperty()
  @Column('timestamptz')
  expires_at: Date;

  @ApiPropertyOptional()
  @Column('timestamptz', { nullable: true })
  completed_at: Date;

  @ApiPropertyOptional({ description: 'Sum of all question ratings' })
  @Column('float', { nullable: true })
  total_score: number;

  @ApiPropertyOptional({ description: 'Max possible score (questions × 5)' })
  @Column({ nullable: true })
  max_possible_score: number;

  @ApiPropertyOptional({ description: 'Percentage: total_score / max × 100' })
  @Column('float', { nullable: true })
  percentage: number;

  @ApiProperty()
  @Column()
  client_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

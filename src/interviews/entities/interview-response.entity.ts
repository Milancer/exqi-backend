import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewSession } from './interview-session.entity';

@Entity('interview_responses')
export class InterviewResponse {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  response_id: number;

  @ApiProperty()
  @Column()
  session_id: number;

  @ManyToOne(() => InterviewSession)
  @JoinColumn({ name: 'session_id' })
  session: InterviewSession;

  @ApiProperty()
  @Column()
  question_id: number;

  @ApiProperty()
  @Column()
  competency_id: number;

  @ApiProperty({ description: 'Rating 1–5' })
  @Column({ type: 'int' })
  rating: number;

  @ApiPropertyOptional()
  @Column('text', { nullable: true })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Behavioral tracking metadata',
    example: {
      paste_detected: false,
      time_spent_seconds: 45,
      keystroke_count: 120,
      focus_lost_count: 0,
    },
  })
  @Column('json', { nullable: true })
  behavioral_flags?: {
    paste_detected?: boolean;
    time_spent_seconds?: number;
    keystroke_count?: number;
    focus_lost_count?: number;
  };

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  INTERVIEW_ASSIGNED = 'InterviewAssigned',
  INTERVIEW_COMPLETED = 'InterviewCompleted',
  JOB_PROFILE_APPROVAL = 'JobProfileApproval',
  GENERAL = 'General',
}

@Entity('notifications')
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  notification_id: number;

  @ApiProperty({ description: 'Recipient user ID' })
  @Column()
  user_id: number;

  @ApiProperty({ enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GENERAL,
  })
  type: NotificationType;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  message: string;

  @ApiProperty()
  @Column({ default: false })
  is_read: boolean;

  @ApiPropertyOptional({ description: 'e.g. interview_session, job_profile' })
  @Column({ nullable: true })
  reference_type: string;

  @ApiPropertyOptional({ description: 'ID of the referenced entity' })
  @Column({ nullable: true })
  reference_id: number;

  @ApiProperty()
  @Column()
  client_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}

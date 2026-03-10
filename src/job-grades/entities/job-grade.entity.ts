import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('job_grades')
export class JobGrade {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  job_grade_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  job_grade: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Deleted'],
    nullable: true,
  })
  status: string;

  @ApiProperty()
  @Column({ default: 1 })
  client_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

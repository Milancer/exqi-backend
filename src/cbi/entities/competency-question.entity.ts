import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Competency } from '../../competencies/entities/competency.entity';

@Entity('competency_questions')
export class CompetencyQuestion {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  competency_question_id: number;

  @ApiProperty()
  @Column()
  competency_id: number;

  @ManyToOne(() => Competency)
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  @ApiProperty()
  @Column()
  level: number;

  @ApiProperty()
  @Column('text')
  question: string;

  @ApiProperty()
  @Column({ default: 1 })
  client_id: number;

  @ApiProperty({ enum: ['Active', 'Inactive', 'Deleted'] })
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
  })
  status: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

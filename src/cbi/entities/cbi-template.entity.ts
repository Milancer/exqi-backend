import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('cbi_templates')
export class CbiTemplate {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  cbi_template_id: number;

  @ApiProperty()
  @Column()
  template_name: string;

  @ApiPropertyOptional({
    example: 'Standard competency-based interview template',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: [
      { competency_id: 1, level: 3 },
      { competency_id: 2, level: 4 },
    ],
    description: 'Array of competencies with required levels',
  })
  @Column('json', { nullable: true })
  competencies: Array<{
    competency_id: number;
    level: number;
  }>;

  @ApiPropertyOptional({
    example: [1, 5, 12, 18, 22],
    description: 'Array of selected question IDs for this template',
  })
  @Column('json', { nullable: true })
  questions: number[];

  @ApiProperty()
  @Column({ default: 1 })
  client_id: number;

  @ApiPropertyOptional({
    description: 'Question limits configuration',
    example: { use_global_limit: true, global_limit: 3, local_limit: 2 },
  })
  @Column('json', { nullable: true })
  question_limits: {
    use_global_limit: boolean;
    global_limit?: number;
    local_limit?: number;
  };

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

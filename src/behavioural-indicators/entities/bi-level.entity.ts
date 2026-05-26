import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BiCompetency } from './bi-competency.entity';

@Entity('bi_levels')
export class BiLevel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  bi_level_id: number;

  @ApiProperty()
  @Column()
  bi_competency_id: number;

  @ApiProperty({ description: 'Proficiency level 1-5' })
  @Column({ type: 'int' })
  level: number;

  @ApiProperty({ description: 'e.g. Novice, Developing, Proficient' })
  @Column({ type: 'varchar', length: 100 })
  level_label: string;

  @ApiProperty({ description: 'Short summary headline for this level' })
  @Column({ type: 'text', nullable: true })
  level_subtitle: string;

  @ApiProperty({
    description: 'Behavioural indicator bullets for this level',
    type: [String],
  })
  @Column({ type: 'simple-json' })
  indicators: string[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => BiCompetency, (c) => c.levels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bi_competency_id' })
  competency: BiCompetency;
}

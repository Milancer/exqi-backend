import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BiLevel } from './bi-level.entity';

@Entity('bi_competencies')
export class BiCompetency {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  bi_competency_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  category: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  competency_name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => BiLevel, (level) => level.competency, { cascade: true })
  levels: BiLevel[];
}

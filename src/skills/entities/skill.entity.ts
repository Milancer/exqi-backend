import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('skills')
export class Skill {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  skill_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  skill: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  indicators: any;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
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

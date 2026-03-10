import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('work_levels')
export class WorkLevel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  work_level_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  level_of_work: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45, nullable: true })
  scope: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  focus: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  judgement: string;

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

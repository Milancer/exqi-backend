import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('departments')
export class Department {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  department_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  department: string;

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

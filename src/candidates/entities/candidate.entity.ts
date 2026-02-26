import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Client } from '../../clients/entities/client.entity';

export enum CandidateStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

@Entity('candidates')
export class Candidate {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  candidate_id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  surname: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  email: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'Position/role the candidate is applying for' })
  @Column()
  position: string;

  @ApiProperty()
  @Column()
  client_id: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ApiProperty({ enum: CandidateStatus })
  @Column({
    type: 'enum',
    enum: CandidateStatus,
    default: CandidateStatus.ACTIVE,
  })
  status: CandidateStatus;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

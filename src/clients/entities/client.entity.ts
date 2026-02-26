import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClientModule {
  JOB_PROFILE = 'Job Profile',
  COMPETENCY_BASED_INTERVIEW = 'Competency Based Interview',
}

@Entity()
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  industry: string;

  @ApiProperty()
  @Column()
  division: string;

  // Primary Contact
  @ApiProperty()
  @Column()
  contactName: string;

  @ApiProperty()
  @Column()
  contactSurname: string;

  @ApiProperty()
  @Column()
  position: string;

  @ApiProperty()
  @Column()
  contactPhoneNumber: string;

  @ApiProperty()
  @Column()
  contactEmail: string;

  // HR Contact
  @ApiProperty()
  @Column()
  hrContactName: string;

  @ApiProperty()
  @Column()
  hrContactSurname: string;

  @ApiProperty()
  @Column()
  hrContactPhoneNumber: string;

  @ApiProperty()
  @Column()
  hrContactEmail: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  logo: string;

  @ApiPropertyOptional({ description: 'List of active modules', example: ['JOB_PROFILES', 'COMPETENCY_BASED_INTERVIEWS'] })
  @Column('text', { array: true, default: [] })
  modules: string[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

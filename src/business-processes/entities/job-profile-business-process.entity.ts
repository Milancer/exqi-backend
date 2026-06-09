import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JobProfile } from '../../job-profiles/entities/job-profile.entity';
import { BusinessProcessNode } from './business-process-node.entity';

/**
 * Many-to-many join between JobProfile and BusinessProcessNode.
 *
 * Persists ONLY the user's leaf-most picks — typically procedure rows, but
 * sub-process rows if the user stops at that level. The Group is derived
 * by walking the parent chain, so we never persist Group selections here.
 *
 * Composite PK (job_profile_id, business_process_node_id) prevents duplicates
 * and gives us a free index for the JP-side lookup.
 *
 * RACI flags describe how this job profile relates to the process. Multiple
 * flags can be true at once (e.g. a profile that does the work AND must be
 * informed of outcomes is both R and I).
 */
@Entity('job_profile_business_processes')
export class JobProfileBusinessProcess {
  @ApiProperty()
  @PrimaryColumn()
  job_profile_id: number;

  @ApiProperty()
  @PrimaryColumn()
  business_process_node_id: number;

  @ApiProperty({ description: 'Does the work' })
  @Column({ type: 'boolean', default: false })
  is_responsible: boolean;

  @ApiProperty({ description: 'Owns the outcome (ideally one per process)' })
  @Column({ type: 'boolean', default: false })
  is_accountable: boolean;

  @ApiProperty({ description: 'Input is sought before decisions' })
  @Column({ type: 'boolean', default: false })
  is_consulted: boolean;

  @ApiProperty({ description: 'Kept informed after the fact' })
  @Column({ type: 'boolean', default: false })
  is_informed: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => JobProfile, (jp) => jp.businessProcesses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_profile_id' })
  jobProfile: JobProfile;

  @ManyToOne(() => BusinessProcessNode, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_process_node_id' })
  node: BusinessProcessNode;
}

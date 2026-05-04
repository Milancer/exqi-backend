import {
  Entity,
  PrimaryColumn,
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
 */
@Entity('job_profile_business_processes')
export class JobProfileBusinessProcess {
  @ApiProperty()
  @PrimaryColumn()
  job_profile_id: number;

  @ApiProperty()
  @PrimaryColumn()
  business_process_node_id: number;

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

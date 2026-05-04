import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Levels in the SITA Business Process hierarchy.
 *   group        — Enterprise / Core / Support  (3 nodes, no parent)
 *   process      — e.g. "M1 Manage Strategy"     (8 / 10 / 9 nodes per group)
 *   sub_process  — e.g. "M1.1 Manage Org Culture Health"
 *   procedure    — e.g. "M1.1.1 Maintain ideal culture definition"  (leaf)
 */
export const BP_LEVELS = ['group', 'process', 'sub_process', 'procedure'] as const;
export type BpLevel = (typeof BP_LEVELS)[number];

/**
 * Self-referential reference catalogue for the SITA Business Process tree.
 *
 * Imported from the V48 Excel via `pnpm run import:business-processes`.
 * Idempotent on `code` — re-running with V49/V50 updates names in place
 * without breaking the join rows on `job_profile_business_processes`.
 */
@Entity('business_process_nodes')
@Unique('UQ_business_process_node_code', ['code'])
@Index(['parent_id'])
@Index(['level'])
export class BusinessProcessNode {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ description: 'Self-referential parent node id' })
  @Column({ nullable: true })
  parent_id: number | null;

  @ApiProperty({ enum: BP_LEVELS })
  @Column({
    type: 'enum',
    enum: BP_LEVELS,
  })
  level: BpLevel;

  /**
   * Stable natural key from the SITA Excel.
   *   group:        'Enterprise' | 'Core' | 'Support'
   *   process:      'M1', 'C1', 'S1', …
   *   sub_process:  'M1.1', 'C1.1', 'S1.1', …
   *   procedure:    'M1.1.1', 'C1.1.1', 'S1.1.1', …
   *
   * Used by the importer to upsert idempotently.
   */
  @ApiProperty({ example: 'M1.1.1' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'Maintain ideal culture definition' })
  @Column('text')
  name: string;

  @ApiPropertyOptional({ description: 'Long-form definition / description, when present in the source' })
  @Column('text', { nullable: true })
  definition: string | null;

  @ApiPropertyOptional({ description: 'Display sort order within siblings' })
  @Column({ default: 0 })
  sort_order: number;

  @ApiPropertyOptional({ description: 'Whether this node is selectable on a Job Profile (false = header only)' })
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => BusinessProcessNode, (n) => n.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: BusinessProcessNode | null;

  @OneToMany(() => BusinessProcessNode, (n) => n.parent)
  children: BusinessProcessNode[];
}

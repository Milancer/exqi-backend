import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompetencyType } from './competency-type.entity';
import { CompetencyCluster } from './competency-cluster.entity';

@Entity('competencies')
export class Competency {
  @PrimaryGeneratedColumn()
  competency_id: number;

  @Column()
  competency_type_id: number;

  @Column()
  competency_cluster_id: number;

  @Column({ type: 'varchar', length: 255 })
  competency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  indicators: string;

  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
  })
  status: string;

  @Column({ default: 1 })
  client_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => CompetencyType)
  @JoinColumn({ name: 'competency_type_id' })
  competencyType: CompetencyType;

  @ManyToOne(() => CompetencyCluster)
  @JoinColumn({ name: 'competency_cluster_id' })
  competencyCluster: CompetencyCluster;
}

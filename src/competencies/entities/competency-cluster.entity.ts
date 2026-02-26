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

@Entity('competency_clusters')
export class CompetencyCluster {
  @PrimaryGeneratedColumn()
  competency_cluster_id: number;

  @Column()
  competency_type_id: number;

  @Column({ type: 'varchar', length: 255 })
  cluster_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
  })
  status: string;

  @Column({ default: 1 })
  client_id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => CompetencyType)
  @JoinColumn({ name: 'competency_type_id' })
  competencyType: CompetencyType;
}

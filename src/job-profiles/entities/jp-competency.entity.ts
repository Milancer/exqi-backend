import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JpCompetencyType } from './jp-competency-type.entity';
import { JpCompetencyCluster } from './jp-competency-cluster.entity';

@Entity('jp_competencies')
export class JpCompetency {
  @PrimaryGeneratedColumn()
  jp_competency_id: number;

  @Column()
  jp_competency_type_id: number;

  @Column()
  jp_competency_cluster_id: number;

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

  @ManyToOne(() => JpCompetencyType)
  @JoinColumn({ name: 'jp_competency_type_id' })
  competencyType: JpCompetencyType;

  @ManyToOne(() => JpCompetencyCluster)
  @JoinColumn({ name: 'jp_competency_cluster_id' })
  competencyCluster: JpCompetencyCluster;
}

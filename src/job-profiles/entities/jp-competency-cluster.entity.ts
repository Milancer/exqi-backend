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

@Entity('jp_competency_clusters')
export class JpCompetencyCluster {
  @PrimaryGeneratedColumn()
  jp_competency_cluster_id: number;

  @Column()
  jp_competency_type_id: number;

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

  @ManyToOne(() => JpCompetencyType)
  @JoinColumn({ name: 'jp_competency_type_id' })
  competencyType: JpCompetencyType;
}

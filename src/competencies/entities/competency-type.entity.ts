import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('competency_types')
export class CompetencyType {
  @PrimaryGeneratedColumn()
  competency_type_id: number;

  @Column({ type: 'varchar', length: 255 })
  competency_type: string;

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
}

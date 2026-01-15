import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ChecklistFrequency } from '../../../shared/types/checklist.types';
import { SiteSize } from '../../../shared/types/site.types';

@Entity('checklist_templates')
export class ChecklistTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string; // e.g., "Checklist Quotidienne", "Checklist Hebdomadaire"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ChecklistFrequency,
  })
  frequency: ChecklistFrequency;

  @Column({
    type: 'enum',
    enum: SiteSize,
    nullable: true,
  })
  siteSize: SiteSize; // Template can be specific to site size (SMALL, MEDIUM, LARGE)

  @Column({ type: 'simple-json' })
  zones: {
    zoneName: string;
    tasks: string[];
  }[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

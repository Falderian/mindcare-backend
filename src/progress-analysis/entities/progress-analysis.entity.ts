import { Patient } from '../../patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProgressAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  progressSummary: string;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

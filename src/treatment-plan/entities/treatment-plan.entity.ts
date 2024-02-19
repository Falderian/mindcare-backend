import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TreatmentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column()
  description: string;

  @Column({ default: 'In progress' })
  status: string;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

import { Patient } from '../../patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'timestamptz' })
  payment_date: Date;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

import { Patient } from '../../patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ default: 'online' })
  type: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Patient, (consulations) => consulations, { nullable: true })
  patient: Patient;
}

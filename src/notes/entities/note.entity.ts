import { Patient } from '../../patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  moodRating: number;

  @Column()
  text: string;

  @Column()
  conclusion: string;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

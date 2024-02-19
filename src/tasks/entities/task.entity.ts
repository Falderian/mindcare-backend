import { PatientProfile } from 'src/patientprofile/entities/patientprofile.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  description: string;

  @Column({ default: 'pending' })
  taskStatus: string;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @ManyToOne(() => PatientProfile)
  patient: PatientProfile;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

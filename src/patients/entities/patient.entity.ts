import { TreatmentPlan } from '../../treatment-plan/entities/treatment-plan.entity';
import { Note } from '../../notes/entities/note.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => Note, (notes) => notes, { cascade: true })
  notes: Note[];

  @OneToMany(() => TreatmentPlan, (treatmentPlans) => treatmentPlans, { cascade: true })
  treatmentPlans: TreatmentPlan[];

  @OneToMany(() => Task, (tasks) => tasks, { cascade: true })
  tasks: Task[];

  @OneToMany(() => Consultation, (consultations) => consultations, { cascade: true })
  consultations: Consultation[];
}

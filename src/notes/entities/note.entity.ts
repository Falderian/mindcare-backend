import { PatientProfile } from 'src/patientprofile/entities/patientprofile.entity';
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

  @ManyToOne(() => PatientProfile)
  patient: PatientProfile;
}

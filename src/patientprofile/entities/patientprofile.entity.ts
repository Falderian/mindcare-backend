import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatientProfile {
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
}

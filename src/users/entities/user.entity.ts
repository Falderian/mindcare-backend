import { Chat } from '../../chat/entities/chat.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, JoinTable, ManyToMany } from 'typeorm';

export enum UserRole {
  Therapist = 'therapist',
  Patient = 'patient',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Patient })
  role: UserRole;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => Patient, { nullable: true, cascade: true })
  @JoinColumn()
  patient: Patient | null;

  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable()
  chats: Chat[];
}

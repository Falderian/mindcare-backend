import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Note } from '../notes/entities/note.entity';
import { Patient } from '../patients/entities/patient.entity';
import { ProgressAnalysis } from '../progress-analysis/entities/progress-analysis.entity';
import { Task } from '../tasks/entities/task.entity';
import { TreatmentPlan } from '../treatment-plan/entities/treatment-plan.entity';
import { User } from '../users/entities/user.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { Message } from '../messages/entities/message.entity';

config();

const database = process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME;

export const DBConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User, Patient, Note, Task, ProgressAnalysis, TreatmentPlan, Consultation, Message],
  synchronize: true,
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false, // Set to true if you have a valid SSL certificate, false for self-signed certificates
  },
});

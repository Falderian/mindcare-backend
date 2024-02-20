import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Note } from '../notes/entities/note.entity';
import { Patient } from '../patients/entities/patient.entity';
import { ProgressAnalysis } from '../progress-analysis/entities/progress-analysis.entity';
import { Task } from '../tasks/entities/task.entity';
import { TreatmentPlan } from '../treatment-plan/entities/treatment-plan.entity';
import { User } from '../users/entities/user.entity';

config();

const database = process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME;

export const DBConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'db',
  port: 5432,
  database,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, Patient, Note, Task, ProgressAnalysis, TreatmentPlan],
  synchronize: true,
  autoLoadEntities: true,
});

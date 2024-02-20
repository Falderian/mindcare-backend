import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Task } from '../tasks/entities/task.entity';
import { Note } from '../notes/entities/note.entity';
import { ProgressAnalysis } from 'src/progress-analysis/entities/progress-analysis.entity';
import { TreatmentPlan } from 'src/treatment-plan/entities/treatment-plan.entity';

config();

export const DBConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'db',
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, Patient, Note, Task, ProgressAnalysis, TreatmentPlan],
  synchronize: true,
  autoLoadEntities: true,
});

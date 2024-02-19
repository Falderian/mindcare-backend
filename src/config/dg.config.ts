import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { PatientProfile } from '../patientprofile/entities/patientprofile.entity';

config();

export const DBConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'db',
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, PatientProfile],
  synchronize: true,
  autoLoadEntities: true,
});

import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { PatientProfile } from '../patientprofile/entities/patientprofile.entity';

config();

const configs = {
  dev: {
    type: 'postgres',
    host: 'db',
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [User, PatientProfile],
    synchronize: true,
    autoLoadEntities: true,
  },
  test: {
    type: 'postgres',
    host: 'db',
    port: 5432,
    database: 'test_database',
    username: 'postgres',
    password: 'postgres',
    entities: [User, PatientProfile],
    synchronize: true,
    autoLoadEntities: true,
  },
};

export const DBConfig = TypeOrmModule.forRoot(configs[process.env.NODE_ENV || 'dev']);

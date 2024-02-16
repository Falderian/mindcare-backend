import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';

config();

export const DBConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  autoLoadEntities: true,
});

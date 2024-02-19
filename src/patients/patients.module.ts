import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patients.controller';
import { PatientsService } from './patients.service';
import { UsersModule } from '../users/users.module';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}

import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { PatientsModule } from '../patients/patients.module';
import { ConsultationsService } from './consultations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation]), PatientsModule],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
})
export class ConsultationsModule {}

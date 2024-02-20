import { Module } from '@nestjs/common';
import { TreatmentPlanController } from './treatment-plan.controller';
import { TreatmentPlanService } from './treatment-plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentPlan]), PatientsModule],
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService],
})
export class TreatmentPlanModule {}

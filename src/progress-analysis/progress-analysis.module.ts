import { Module } from '@nestjs/common';
import { ProgressAnalysisService } from './progress-analysis.service';
import { ProgressAnalysisController } from './progress-analysis.controller';
import { ProgressAnalysis } from './entities/progress-analysis.entity';
import { PatientsModule } from '../patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressAnalysis]), PatientsModule],
  controllers: [ProgressAnalysisController],
  providers: [ProgressAnalysisService],
})
export class ProgressAnalysisModule {}

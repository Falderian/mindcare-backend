import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProgressAnalysisDto } from './dto/create-progress-analysis.dto';
import { UpdateProgressAnalysisDto } from './dto/update-progress-analysis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgressAnalysis } from './entities/progress-analysis.entity';
import { Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class ProgressAnalysisService {
  constructor(
    @InjectRepository(ProgressAnalysis)
    private analysisesRepository: Repository<ProgressAnalysis>,
    private patientsService: PatientsService,
  ) {}

  async create(createProgressAnalysisDto: CreateProgressAnalysisDto) {
    const patient = await this.patientsService.findOne(createProgressAnalysisDto.patientId);
    try {
      const newProgress = await this.analysisesRepository.save({ ...createProgressAnalysisDto, patient });
      return newProgress;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllAnalysesOfPatient(id: number) {
    const patient = await this.patientsService.findOne(id);
    try {
      const analyses = await this.analysisesRepository.findBy({ patient });
      return analyses;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const analysis = await this.analysisesRepository.findOneBy({ id });
      return analysis;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateProgressAnalysisDto: UpdateProgressAnalysisDto) {
    const analysis = await this.findOne(id);
    try {
      const updatedAnalysis = await this.analysisesRepository.save({ ...analysis, ...updateProgressAnalysisDto });
      return updatedAnalysis;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const note = await this.findOne(id);
      await this.analysisesRepository.remove(note);
      return { message: 'Note removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

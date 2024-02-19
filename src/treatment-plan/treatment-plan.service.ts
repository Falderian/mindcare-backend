import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { Repository } from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class TreatmentPlanService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private plansRepository: Repository<TreatmentPlan>,
    private patientsService: PatientsService,
  ) {}

  async create(createTreatmentPlanDto: CreateTreatmentPlanDto) {
    try {
      const patient = await this.patientsService.findOne(createTreatmentPlanDto.patientId);
      const newPlan = await this.plansRepository.save({ ...createTreatmentPlanDto, patient });
      return newPlan;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findAllPlansOfPatient(id: number) {
    try {
      const patient = await this.patientsService.findOne(id);
      const allPlans = await this.plansRepository.findBy({ patient });
      return allPlans;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findOne(id: number) {
    const plan = await this.plansRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException('Treatment plan is not found');
    }

    return plan;
  }

  async update(id: number, patientTreatmentPlanDto: UpdateTreatmentPlanDto) {
    const plan = await this.findOne(id);
    try {
      const updatePlan = await this.plansRepository.save({ ...plan, ...patientTreatmentPlanDto });
      return updatePlan;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async remove(id: number) {
    const plan = await this.findOne(id);
    try {
      await this.plansRepository.remove(plan);
      return `Treatment plan with id ${id} has been successfully removed`;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }
}

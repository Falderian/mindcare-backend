import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consulationsRepo: Repository<Consultation>,
    private patientsService: PatientsService,
  ) {}

  async create(createConsultationDto: CreateConsultationDto) {
    const patient = await this.patientsService.findOne(createConsultationDto.patientId);
    try {
      const newConsultation = await this.consulationsRepo.save({ ...createConsultationDto, patient });
      return newConsultation;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllConsulationsOfPatient(id: number) {
    const patient = await this.patientsService.findOne(id);
    try {
      const consultations = await this.consulationsRepo.find({ where: { patient } });
      return consultations;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const consultation = await this.consulationsRepo.findOneBy({ id });
      return consultation;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateConsultationDto: UpdateConsultationDto) {
    try {
      const consulation = await this.findOne(id);
      const updatedConsulation = await this.consulationsRepo.save({ ...consulation, ...updateConsultationDto });
      return updatedConsulation;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const consulation = await this.findOne(id);
      await this.consulationsRepo.remove(consulation);
      return { message: 'Consultation removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

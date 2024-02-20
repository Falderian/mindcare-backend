import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const user = await this.userService.findOne(createPatientDto.userId);
    if (user.patient) throw new UnprocessableEntityException('User is already had a patient');
    if (user.role !== 'patient') throw new UnprocessableEntityException('User is not a patient');
    try {
      const newPatient = this.patientsRepository.create(createPatientDto);
      user.patient = newPatient;
      await this.usersRepository.save(user);
      return newPatient;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException('Patient patient is not found');
    }

    return patient;
  }

  async update(id: number, patientUpdateDto: UpdatePatientDto) {
    const patient = await this.findOne(id);
    try {
      const updatedpatient = await this.patientsRepository.save({ ...patient, ...patientUpdateDto });
      return updatedpatient;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async remove(id: number) {
    const patient = await this.findOne(id);
    try {
      const user = await this.usersRepository.findOne({ where: { patient: patient } });
      if (user) {
        user.patient = null;
        await this.usersRepository.save(user);
      }
      await this.patientsRepository.remove(patient);
      return `Patient with id ${id} has been successfully removed`;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class PaymentsService {
  constructor(
    private patientsSerivce: PatientsService,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const patient = await this.patientsSerivce.findOne(createPaymentDto.patientId);
    try {
      const newPayment = await this.paymentsRepo.save({ ...createPaymentDto, patient });
      return newPayment;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findAll() {
    try {
      return await this.paymentsRepo.find();
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findOne(id: number) {
    try {
      return await this.paymentsRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async update(id: number, paymentDto: UpdatePaymentDto) {
    const plan = await this.findOne(id);
    try {
      const updatedPayment = await this.paymentsRepo.save({ ...plan, ...paymentDto });
      return updatedPayment;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async remove(id: number) {
    const plan = await this.findOne(id);
    try {
      await this.paymentsRepo.remove(plan);
      return `Payment with id ${id} has been successfully removed`;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }
}

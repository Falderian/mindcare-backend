import { TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { setupTestingModule, clearDatabase, createPatient, createUser } from '../utils/testUtils';
import { Payment } from './entities/payment.entity';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../users/entities/user.entity';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let module: TestingModule;
  let createdPayment: Payment;
  let user: User;
  let patient: Patient;

  const createPaymentDto: CreatePaymentDto = {
    patientId: 0,
    amount: 100,
    payment_date: new Date(),
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<PaymentsController>(PaymentsController);

    user = await createUser(module, {
      email: 'payment@test.com',
      password: 'password',
      name: 'Test User',
      role: 'patient',
    });

    patient = await createPatient(module, {
      userId: user.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      address: '123 Main Street',
      phoneNumber: '1234567890',
    });

    createPaymentDto.patientId = patient.id;
  });

  afterAll(async () => await clearDatabase(module));

  it('should create a payment', async () => {
    createdPayment = await controller.create(createPaymentDto);
    expect(createdPayment).toBeDefined();
    expect(createdPayment.patient.id).toBe(createPaymentDto.patientId);
    expect(createdPayment.amount).toBe(createPaymentDto.amount);
    expect(createdPayment.payment_date).toEqual(createPaymentDto.payment_date);
  });

  it('should find all payments', async () => {
    const foundPayments = await controller.findAll();
    expect(foundPayments).toBeInstanceOf(Array);
  });

  it('should find a payment by ID', async () => {
    const foundPayment = await controller.findOne(createdPayment.id.toString());
    expect(foundPayment.id).toEqual(createdPayment.id);
    expect(foundPayment.payment_date).toEqual(createdPayment.payment_date);
  });

  it('should update a payment', async () => {
    const updatePaymentDto: UpdatePaymentDto = {
      status: 'complete',
    };
    const updatedPayment = await controller.update(createdPayment.id.toString(), updatePaymentDto);
    expect(updatedPayment.status).toEqual(updatePaymentDto.status);
  });

  it('should remove a payment', async () => {
    const result = await controller.remove(createdPayment.id.toString());
    expect(result).toEqual(`Payment with id ${createdPayment.id} has been successfully removed`);
  });
});

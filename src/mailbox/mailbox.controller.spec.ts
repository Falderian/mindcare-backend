import { TestingModule } from '@nestjs/testing';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';
import { UpdateMailboxDto } from './dto/update-mailbox.dto';
import { Mailbox } from './entities/mailbox.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { setupTestingModule, clearDatabase, createUser, createPatient } from '../utils/testUtils';
import { UserRole } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';

describe('MailboxController', () => {
  let controller: MailboxController;
  let module: TestingModule;

  let createdMailbox: Mailbox;
  let user: {
    id: any;
    mailbox?: { id: number };
    email?: string;
    name?: string;
    password?: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    patient?: Patient;
  };

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<MailboxController>(MailboxController);

    createdMailbox = await createUserMailbox();
  });

  afterAll(async () => await clearDatabase(module));

  const createUserMailbox = async (): Promise<Mailbox> => {
    user = await createUser(module, {
      email: 'test@test.com',
      password: 'password',
      name: 'Test User',
      role: 'patient',
    });
    const mailbox = await controller.findOne(user.mailbox.id.toString());
    return mailbox;
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a mailbox', async () => {
      const result = await controller.findOne(user.mailbox.id.toString());
      expect(result).toEqual(createdMailbox);
    });

    it('should throw NotFoundException if mailbox is not found', async () => {
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a mailbox', async () => {
      const updateDto: UpdateMailboxDto = { new_messages_count: 1 };
      const updatedMailbox = await controller.update(user.mailbox.id.toString(), updateDto);
      expect(updatedMailbox.new_messages_count).toEqual(updateDto.new_messages_count);
    });
  });

  describe('remove', () => {
    it('should remove a mailbox', async () => {
      const result = await controller.remove(user.mailbox.id.toString());
      expect(result).toEqual({ message: 'Mailbox removed successfully' });
    });

    it('should throw BadRequestException if remove fails', async () => {
      await expect(controller.remove(user.mailbox.id.toString())).rejects.toThrow(BadRequestException);
    });
  });
});

import { TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { CreateMessageDto } from './dto/create-message.dto';
import { setupTestingModule, clearDatabase, createUser } from '../utils/testUtils';
import { UserRole } from 'src/users/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';

describe('MessagesController', () => {
  let controller: MessagesController;
  let module: TestingModule;
  let createdMessage: any;
  let senderId: number;
  let recipientId: number;

  beforeAll(async () => {
    module = await setupTestingModule();
    controller = module.get<MessagesController>(MessagesController);

    senderId = (await createUser(module, { email: 'sender2@test.com', password: 'password', name: 'Sender2' })).mailbox
      .id;
    recipientId = (
      await createUser(module, {
        email: 'recipient2@test.com',
        password: 'password',
        name: 'Recipient2',
      })
    ).mailbox.id;

    console.error(senderId, recipientId);
  });

  it('should create a message', async () => {
    const createMessageDto: CreateMessageDto = {
      content: 'Another test message',
      senderId,
      recipientId,
    };
    const created = await controller.create(createMessageDto);
    expect(created).toBeDefined();
    expect(created.mailboxId).toBeDefined();
    expect(created.message).toBeDefined();
    expect(created.message.content).toEqual(createMessageDto.content);
  });

  // it('should return a message', async () => {
  //   const result = await controller.findOne(createdMessage.id.toString());
  //   expect(result).toEqual(createdMessage);
  // });

  // it('should update a message', async () => {
  //   const updateDto: UpdateMessageDto = { content: 'Updated test message' };
  //   const updatedMessage = await controller.update(createdMessage.id.toString(), updateDto);
  //   expect(updatedMessage.content).toEqual(updateDto.content);
  // });

  // it('should remove a message', async () => {
  //   const result = await controller.remove(createdMessage.id.toString());
  //   expect(result).toEqual({ message: 'Message removed successfully' });
  // });
});

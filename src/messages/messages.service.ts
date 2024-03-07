import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { MailboxService } from '../mailbox/mailbox.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
    private mailboxService: MailboxService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const mailbox = await this.mailboxService.findByUser(createMessageDto.recipientId);
    try {
      const message = await this.messagesRepo.save({
        mailbox,
        ...createMessageDto,
      });
      await this.mailboxService.update(mailbox.id, { new_messages_count: mailbox.new_messages_count + 1 });
      delete message.mailbox;
      return { mailboxId: mailbox.id, message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const message = await this.messagesRepo.findOneByOrFail({ id });
      return message;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.findOne(id);
      const updatedMessage = await this.messagesRepo.save({ ...message, ...updateMessageDto });
      return updatedMessage;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const message = await this.findOne(id);
      await this.messagesRepo.remove(message);
      return { message: 'Message removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
    private chatService: ChatService,
    private usersService: UsersService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const [sender, recepient] = [
      await this.usersService.findOne(createMessageDto.senderId),
      await this.usersService.findOne(createMessageDto.recepientId),
    ];
    try {
      const newMessage = await this.messagesRepo.save({
        ...createMessageDto,
        sender: sender.id,
        recepient: recepient.id,
      });
      return newMessage;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

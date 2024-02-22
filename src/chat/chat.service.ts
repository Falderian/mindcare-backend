import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UsersService } from '../users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const usersId = [createChatDto.recipientId, createChatDto.senderId];
    const isExists = await this.findChat(usersId);
    if (isExists) return isExists;
    try {
      const newChat = await this.chatRepository.save(this.sortedUsersId(usersId));
      return newChat;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findChat(usersId: number[]) {
    try {
      const usersPayload = this.sortedUsersId(usersId);
      const chat = await this.chatRepository.findOne({ where: usersPayload });
      return chat;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  private sortedUsersId = (usersId: number[]) => {
    const sorted = usersId.sort((a, b) => a - b);
    return { recipientId: sorted[0], senderId: sorted[1] };
  };
}

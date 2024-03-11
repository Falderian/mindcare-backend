import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepo: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async createChat(usersId: number[]) {
    try {
      const users = await this.usersService.findManyUsers(usersId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOne(userIds: number[]) {
    const chats = await this.chatsRepo.find({
      relations: ['users'],
    });
    const matchingChat = chats.find((chat) => {
      const chatUserIds = chat.users.map((user) => user.id);
      return userIds.every((userId) => chatUserIds.includes(userId));
    });

    return matchingChat;
  }
}

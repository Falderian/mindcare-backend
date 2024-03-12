import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepo: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async createChat(usersIds: number[]) {
    try {
      const users = await this.usersService.findManyUsers(usersIds);

      const chat = await this.chatsRepo.save({ users });

      const updateUserDto: UpdateUserDto = { chat };
      await Promise.all(
        users.map(async (user) => {
          await this.usersService.update(user.id, updateUserDto);
        }),
      );

      return chat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findChat(usersIds: number[]) {
    try {
      const existingChat = await this.chatsRepo
        .createQueryBuilder('chat')
        .innerJoinAndSelect('chat.users', 'user', 'user.id IN (:...ids)', { ids: usersIds })
        .getOne();

      return existingChat;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findChatById(id: number) {
    return await this.chatsRepo.findOneOrFail({ where: { id }, relations: ['users'] });
  }
}

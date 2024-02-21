import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async createPrivateChat(usersId: number[]) {
    const isExistUsers = usersId.map(async (userId) => (await this.usersService.findOne(userId)).id);
    try {
      const isChatExists = await this.findOneByUsers(usersId);
      console.log(isChatExists);
      if (isChatExists) throw new NotAcceptableException('The chat for this users is already exists');
      const sortedUsersId = this.sortIds(usersId);

      // const newChat = await this.chatRepository.save({ usersId: sortedUsersId });
      // return newChat;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findOneByUsers(usersId: number[]) {
    try {
      const sortedUsersId = this.sortIds(usersId);
      const queryBuilder = this.chatRepository.createQueryBuilder('chat');
      queryBuilder.where(`ARRAY[:...userIds] <@ chat.usersId`, { userIds: sortedUsersId });
      return await queryBuilder.getOne();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private sortIds = (usersId: number[]) => usersId.sort((a, b) => a - b);
}

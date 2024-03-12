import { Body, Controller, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async createChat(@Body() body: { usersIds: number[] }) {
    return await this.chatsService.createChat(body.usersIds);
  }
}

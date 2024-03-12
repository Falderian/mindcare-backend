import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { UsersModule } from '../users/users.module';
import { ChatsController } from './chats.controller';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule, MessagesModule],
  providers: [ChatsService, ChatsGateway],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}

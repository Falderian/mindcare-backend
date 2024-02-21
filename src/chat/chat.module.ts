import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat])],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}

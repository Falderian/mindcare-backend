import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): void {
    this.server.emit('message', data);
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(@MessageBody() userIds: number[]) {
    this.server.emit('message', await this.chatService.createPrivateChat(userIds));
  }
}

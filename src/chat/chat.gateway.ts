import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private messagesService: MessagesService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    console.log(`Received message from ${client.id}: ${message}`);
    this.server.emit('message', { sender: client.id, message });
  }

  @SubscribeMessage('createChat')
  async handleChatCreation(@MessageBody() body: { senderId: number; recipientId: number }) {
    try {
      const chat = await this.chatService.create(body);
      this.server.emit('message', chat);
    } catch (error) {
      console.log(error);
    }
  }
}

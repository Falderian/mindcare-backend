import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatsService } from './chats.service';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  connectedUsers: Map<number, { user: User; socket: Socket }> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly chatsSerrvice: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { chatId: number; message: string }): Promise<void> {
    const senderId = +client.handshake.query.userId;
    const { chatId, message } = payload;
    try {
      const chat = await this.chatsSerrvice.findChatById(chatId);
      const recipientId = chat.users.find((user) => user.id !== senderId).id;
      const newMessage = await this.messagesService.create({ chatId, senderId, recipientId, message });
      this.notifyUserNewMessage(recipientId);
      client.send(newMessage);
    } catch (error) {
      console.log('Error:', error);
      client.send(error.message);
    }
  }

  afterInit() {
    console.log('WebSockets server has been initialized.');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const userId = +client.handshake.query.userId;
    try {
      const user = await this.usersService.findOne(userId);
      this.connectedUsers.set(userId, { user, socket: client });
    } catch (error) {
      client.send(error.message);
      console.log(`There is no user with id = ${userId}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(+client.handshake.query.userId);
    client.send('You have been disconnected');
  }

  notifyUserNewMessage(userId: number) {
    const isUserConnected = this.connectedUsers.get(userId);
    if (isUserConnected) {
      isUserConnected.socket.emit('newMessage', 'You have new message');
    }
  }
}

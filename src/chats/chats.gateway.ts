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
import { Chat } from './entities/chat.entity';
import { UsersService } from 'src/users/users.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  connectedUsers: Map<number, User> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly chatsSerrvice: ChatsService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { recipientId: number; message: string }): Promise<void> {
    const { recipientId, message } = payload;
    try {
      const recipient = await this.usersService.findOne(recipientId);
      console.log(client.handshake.query.userId);
    } catch (error) {}
  }

  afterInit() {
    console.log('WebSockets server has been initialized.');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const userId = +client.handshake.query.userId;
    try {
      const user = await this.usersService.findOne(userId);
      console.log(`Connected ${user.email}`);
      this.connectedUsers.set(userId, user);
      console.log(this.connectedUsers);
    } catch (error) {
      client.send(error.message);
      console.log(`There is no user with id = ${userId}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.send('You have been disconnected');
  }
}

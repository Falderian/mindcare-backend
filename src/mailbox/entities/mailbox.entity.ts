import { AfterInsert, AfterUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message, messageEventEmitter } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Mailbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  new_messages_count: number;

  @OneToOne(() => User, (user) => user.mailbox, { nullable: false })
  user: User;

  @OneToMany(() => Message, (message) => message.mailbox, { nullable: true, cascade: true, eager: true })
  messages: Message[];

  constructor() {
    console.log('Message change event received');
  }

  @AfterInsert()
  @AfterUpdate()
  async updateUnreadMessageCount() {
    console.log('Updating unread message count');
    this.new_messages_count = await this.calculateUnreadMessages();
  }

  private async calculateUnreadMessages(): Promise<number> {
    const unreadMessageCount = this.messages.filter((message) => !message.read_status).length;
    console.log('Unread message count:', unreadMessageCount);
    return unreadMessageCount;
  }
}

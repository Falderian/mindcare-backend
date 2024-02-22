import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mailbox {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.mailbox, { nullable: false })
  user: User;

  @OneToMany(() => Message, (message) => message.mailbox, { nullable: true, cascade: true })
  messages: Message[];
}

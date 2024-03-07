import { Column, Entity, MoreThan, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';

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
}

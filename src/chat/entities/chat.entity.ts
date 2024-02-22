import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column, OneToMany, Index } from 'typeorm';

@Entity()
@Index(['senderId', 'recipientId'], { unique: true })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  recipientId: number;

  @OneToMany(() => Message, (messages) => messages, { cascade: true })
  messages: Message[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

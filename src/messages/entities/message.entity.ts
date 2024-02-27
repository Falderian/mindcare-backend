import { Mailbox } from '../../mailbox/entities/mailbox.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  recipientId: number;

  @Column()
  content: string;

  @Column({ default: false })
  read_status: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Mailbox, (mailbox) => mailbox.messages, { nullable: true })
  mailbox: Mailbox;
}
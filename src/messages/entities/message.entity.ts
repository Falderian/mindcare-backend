import { Mailbox } from 'src/mailbox/entities/mailbox.entity';
import { AfterInsert, AfterUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEmitter } from 'events';

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

  @AfterInsert()
  afterInsert() {
    console.log('Message inserted, emitting event');
    messageEventEmitter.emit('messageChange');
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('Message updated, emitting event');
    messageEventEmitter.emit('messageChange');
  }
}

export const messageEventEmitter = new EventEmitter();

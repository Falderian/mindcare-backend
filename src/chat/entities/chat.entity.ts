import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];

  @Column({ default: 1 })
  user1Order: number;

  @Column({ default: 2 })
  user2Order: number;
}

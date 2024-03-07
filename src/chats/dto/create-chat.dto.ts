import { ArrayContains, Length } from 'class-validator';

export class CreateChatDto {
  @Length(2)
  usersIds: number[];
}

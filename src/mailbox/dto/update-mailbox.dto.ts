import { PartialType } from '@nestjs/mapped-types';
import { CreateMailboxDto } from './create-mailbox.dto';
import { Min } from 'class-validator';

export class UpdateMailboxDto extends PartialType(CreateMailboxDto) {
  @Min(0)
  new_messages_count: number;
}

import { Module, forwardRef } from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { MailboxController } from './mailbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mailbox } from './entities/mailbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mailbox])],
  controllers: [MailboxController],
  providers: [MailboxService],
  exports: [MailboxService],
})
export class MailboxModule {}

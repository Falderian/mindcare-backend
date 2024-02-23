import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMailboxDto } from './dto/update-mailbox.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mailbox } from './entities/mailbox.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailboxService {
  constructor(
    @InjectRepository(Mailbox)
    private mailboxesRepo: Repository<Mailbox>,
  ) {}

  async create(user: User) {
    try {
      const mailbox = await this.mailboxesRepo.save(user);
      return { id: mailbox.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const mailbox = await this.mailboxesRepo.findOneByOrFail({ id });
      return mailbox;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findByUser(id: number) {
    try {
      const mailbox = await this.mailboxesRepo.findOneByOrFail({ user: { id } });
      return mailbox;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async update(id: number, updateMailboxDto: UpdateMailboxDto) {
    try {
      const mailbox = await this.findOne(id);
      const updatedMailbox = await this.mailboxesRepo.save({ ...mailbox, ...updateMailboxDto });
      return updatedMailbox;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const mailbox = await this.findOne(id);
      await this.mailboxesRepo.remove(mailbox);
      return { message: 'Note removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

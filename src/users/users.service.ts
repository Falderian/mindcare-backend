import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Mailbox } from 'src/mailbox/entities/mailbox.entity';
import { MailboxService } from 'src/mailbox/mailbox.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailboxService: MailboxService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isAlreadyExists = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (isAlreadyExists?.email)
      throw new NotAcceptableException('User with email = ' + createUserDto.email + ' is already exists');

    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const createdUser = await this.usersRepository.save(newUser);
      const mailbox = await this.mailboxService.create(createdUser);
      delete createdUser.password;
      return { ...createdUser, mailbox };
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['patient'] });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: this.userWithoutPassword(),
      relations: ['patient'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    try {
      const updatedUser = await this.usersRepository.save({ ...user, ...updateUserDto });
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      await this.usersRepository.remove(user);
      return `User with id ${id} has been successfully removed`;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  private userWithoutPassword(): Array<keyof User> {
    return ['id', 'email', 'role', 'createdAt', 'updatedAt'];
  }
}

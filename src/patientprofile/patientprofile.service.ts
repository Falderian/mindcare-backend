import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePatientProfileDto } from './dto/create-patientprofile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from './entities/patientprofile.entity';
import { UpdatePatientProfileDto } from './dto/update-patientprofile.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PatientProfileService {
  constructor(
    @InjectRepository(PatientProfile)
    private profilesRepository: Repository<PatientProfile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  async create(createPatientprofileDto: CreatePatientProfileDto) {
    const user = await this.userService.findOne(createPatientprofileDto.userId);
    if (user.profile) throw new UnprocessableEntityException('User is already had a profile');
    if (user.role !== 'patient') throw new UnprocessableEntityException('User is not a patient');
    try {
      const newPatientProfile = this.profilesRepository.create(createPatientprofileDto);
      user.profile = newPatientProfile;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    const profile = await this.profilesRepository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException('Patient Profile is not found');
    }

    return profile;
  }

  async update(id: number, profileUpdateDto: UpdatePatientProfileDto) {
    const profile = await this.findOne(id);
    try {
      const updatedProfile = await this.profilesRepository.save({ ...profile, ...profileUpdateDto });
      return updatedProfile;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    try {
      await this.profilesRepository.remove(profile);
      return `Profile with id ${id} has been successfully removed`;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }
}

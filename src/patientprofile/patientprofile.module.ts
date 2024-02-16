import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfileController } from './patientprofile.controller';
import { PatientProfileService } from './patientprofile.service';
import { UsersModule } from '../users/users.module';
import { PatientProfile } from './entities/patientprofile.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PatientProfile])],
  controllers: [PatientProfileController],
  providers: [PatientProfileService],
  exports: [TypeOrmModule],
})
export class PatientProfileModule {}

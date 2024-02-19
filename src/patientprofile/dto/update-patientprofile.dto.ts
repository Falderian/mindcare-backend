import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientProfileDto } from './create-patientprofile.dto';

export class UpdatePatientProfileDto extends PartialType(CreatePatientProfileDto) {}

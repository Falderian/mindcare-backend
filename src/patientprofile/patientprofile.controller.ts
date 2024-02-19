import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdatePatientProfileDto } from './dto/update-patientprofile.dto';
import { CreatePatientProfileDto } from './dto/create-patientprofile.dto';
import { PatientProfileService } from './patientprofile.service';

@Controller('patients')
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @Post()
  create(@Body() createPatientProfileDto: CreatePatientProfileDto) {
    return this.patientProfileService.create(createPatientProfileDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientProfileDto: UpdatePatientProfileDto) {
    return this.patientProfileService.update(+id, updatePatientProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientProfileService.remove(+id);
  }
}

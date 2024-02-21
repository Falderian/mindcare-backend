import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ConsultationsService } from './consultations.service';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.consultationsService.findAllConsulationsOfPatient(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(+id, updateConsultationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationsService.remove(+id);
  }
}

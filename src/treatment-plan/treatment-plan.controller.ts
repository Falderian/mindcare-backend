import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlanService } from './treatment-plan.service';

@Controller('treatment-plan')
export class TreatmentPlanController {
  constructor(private readonly treatmentPlanService: TreatmentPlanService) {}

  @Post()
  create(@Body() createTreatmentPlanDto: CreateTreatmentPlanDto) {
    if (createTreatmentPlanDto.endDate <= createTreatmentPlanDto.startDate) {
      return {
        message: 'End date must be greater than start date',
        statusCode: 400,
      };
    }
    return this.treatmentPlanService.create(createTreatmentPlanDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.treatmentPlanService.findAllPlansOfPatient(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto) {
    return this.treatmentPlanService.update(+id, updateTreatmentPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treatmentPlanService.remove(+id);
  }
}

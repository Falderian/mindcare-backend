import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgressAnalysisService } from './progress-analysis.service';
import { CreateProgressAnalysisDto } from './dto/create-progress-analysis.dto';
import { UpdateProgressAnalysisDto } from './dto/update-progress-analysis.dto';

@Controller('progress-analysis')
export class ProgressAnalysisController {
  constructor(private readonly progressAnalysisService: ProgressAnalysisService) {}

  @Post()
  create(@Body() createProgressAnalysisDto: CreateProgressAnalysisDto) {
    return this.progressAnalysisService.create(createProgressAnalysisDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressAnalysisService.findAllAnalysesOfPatient(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgressAnalysisDto: UpdateProgressAnalysisDto) {
    return this.progressAnalysisService.update(+id, updateProgressAnalysisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressAnalysisService.remove(+id);
  }
}

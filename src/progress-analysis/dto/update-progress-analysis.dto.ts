import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressAnalysisDto } from './create-progress-analysis.dto';

export class UpdateProgressAnalysisDto extends PartialType(CreateProgressAnalysisDto) {}

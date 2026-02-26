import { PartialType } from '@nestjs/swagger';
import { CreateCompetencyQuestionDto } from './create-competency-question.dto';

export class UpdateCompetencyQuestionDto extends PartialType(
  CreateCompetencyQuestionDto,
) {}

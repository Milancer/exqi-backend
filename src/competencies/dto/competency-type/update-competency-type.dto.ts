import { PartialType } from '@nestjs/swagger';
import { CreateCompetencyTypeDto } from './create-competency-type.dto';

export class UpdateCompetencyTypeDto extends PartialType(
  CreateCompetencyTypeDto,
) {}

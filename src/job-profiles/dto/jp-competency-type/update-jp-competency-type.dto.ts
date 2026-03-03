import { PartialType } from '@nestjs/swagger';
import { CreateJpCompetencyTypeDto } from './create-jp-competency-type.dto';

export class UpdateJpCompetencyTypeDto extends PartialType(
  CreateJpCompetencyTypeDto,
) {}

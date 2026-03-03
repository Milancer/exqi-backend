import { PartialType } from '@nestjs/swagger';
import { CreateJpCompetencyDto } from './create-jp-competency.dto';

export class UpdateJpCompetencyDto extends PartialType(CreateJpCompetencyDto) {}

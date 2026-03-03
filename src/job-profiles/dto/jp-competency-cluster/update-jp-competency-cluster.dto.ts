import { PartialType } from '@nestjs/swagger';
import { CreateJpCompetencyClusterDto } from './create-jp-competency-cluster.dto';

export class UpdateJpCompetencyClusterDto extends PartialType(
  CreateJpCompetencyClusterDto,
) {}

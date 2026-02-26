import { PartialType } from '@nestjs/swagger';
import { CreateCompetencyClusterDto } from './create-competency-cluster.dto';

export class UpdateCompetencyClusterDto extends PartialType(
  CreateCompetencyClusterDto,
) {}

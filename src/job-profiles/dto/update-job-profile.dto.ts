import { PartialType } from '@nestjs/swagger';
import { CreateJobProfileDto } from './create-job-profile.dto';

export class UpdateJobProfileDto extends PartialType(CreateJobProfileDto) {}

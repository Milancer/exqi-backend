import { PartialType } from '@nestjs/swagger';
import { CreateCbiTemplateDto } from './create-cbi-template.dto';

export class UpdateCbiTemplateDto extends PartialType(CreateCbiTemplateDto) {}

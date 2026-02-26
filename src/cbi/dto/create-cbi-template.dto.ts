import {
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CompetencySelection {
  @ApiProperty({ example: 1 })
  competency_id: number;

  @ApiProperty({ example: 3, description: 'Required proficiency level (1-5)' })
  level: number;
}

export class CreateCbiTemplateDto {
  @ApiProperty({ example: 'Senior Developer CBI Template' })
  @IsString()
  template_name: string;

  @ApiPropertyOptional({ example: 'Standard interview for senior developers' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: [CompetencySelection],
    example: [
      { competency_id: 1, level: 3 },
      { competency_id: 2, level: 4 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencySelection)
  competencies?: CompetencySelection[];

  @ApiPropertyOptional({
    example: [1, 5, 12, 18, 22],
    description: 'Specific question IDs to include',
  })
  @IsOptional()
  @IsArray()
  questions?: number[];

  @ApiPropertyOptional({
    example: { use_global_limit: true, global_limit: 3, local_limit: 2 },
    description: 'Question limits configuration',
  })
  @IsOptional()
  @IsObject()
  question_limits?: {
    use_global_limit: boolean;
    global_limit?: number;
    local_limit?: number;
  };

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'], default: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

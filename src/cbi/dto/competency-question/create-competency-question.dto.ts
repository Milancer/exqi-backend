import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompetencyQuestionDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the competency this question belongs to',
  })
  @IsNumber()
  competency_id: number;

  @ApiProperty({
    example: 3,
    description: 'Proficiency level (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @ApiProperty({
    example: 'Describe a time when you solved a complex technical problem.',
  })
  @IsString()
  question: string;

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'], default: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

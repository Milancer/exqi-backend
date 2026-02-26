import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCompetencyDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  competency_id: number;

  @ApiProperty({ example: 3, description: 'Required proficiency level (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Is this a critical competency?',
  })
  @IsOptional()
  @IsBoolean()
  is_critical?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Is this a differentiating competency?',
  })
  @IsOptional()
  @IsBoolean()
  is_differentiating?: boolean;
}

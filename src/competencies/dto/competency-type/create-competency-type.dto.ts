import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompetencyTypeDto {
  @ApiProperty({ example: 'Technical' })
  @IsString()
  competency_type: string;

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'], default: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompetencyClusterDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  competency_type_id: number;

  @ApiProperty({ example: 'Problem Solving' })
  @IsString()
  cluster_name: string;

  @ApiPropertyOptional({ example: 'Analytical and critical thinking skills' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['Active', 'Inactive'], default: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Inactive'])
  status?: string;
}

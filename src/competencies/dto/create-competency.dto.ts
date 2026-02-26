import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetencyDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the competency type',
  })
  @IsInt()
  competency_type_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the competency cluster',
  })
  @IsInt()
  competency_cluster_id: number;

  @ApiProperty({
    example: 'Problem Solving',
    description: 'Name of the competency',
  })
  @IsString()
  competency: string;

  @ApiProperty({
    example: 'Ability to analyze and solve complex problems',
    description: 'Detailed description of the competency',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Identifies root causes, develops solutions, evaluates outcomes',
    description: 'Behavioral indicators for the competency',
    required: false,
  })
  @IsOptional()
  @IsString()
  indicators?: string;

  @ApiProperty({
    example: 'Active',
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
    required: false,
  })
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Deleted'])
  status?: string;
}

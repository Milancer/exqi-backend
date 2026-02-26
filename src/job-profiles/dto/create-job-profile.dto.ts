import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobProfileDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  job_title: string;

  @ApiProperty({ example: 'Lead development of core platform features' })
  @IsString()
  job_purpose: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  department_id?: number;

  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiPropertyOptional({ example: 'Software Development' })
  @IsOptional()
  @IsString()
  job_family?: string;

  @ApiPropertyOptional({ example: 'Remote' })
  @IsOptional()
  @IsString()
  job_location?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  level_of_work?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  job_grade_id?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  reports_to?: number;

  @ApiPropertyOptional({
    enum: ['Draft', 'Active', 'Archived'],
    default: 'Draft',
  })
  @IsOptional()
  @IsEnum(['Draft', 'Active', 'Archived'])
  status?: string;
}

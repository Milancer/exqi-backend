import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRequirementsDto {
  @ApiPropertyOptional({ example: "Bachelor's degree in Computer Science" })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({
    example: '5+ years of software development experience',
  })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({ example: 'AWS Certified Solutions Architect' })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiPropertyOptional({
    example: 'Strong communication and leadership skills',
  })
  @IsOptional()
  @IsString()
  other_requirements?: string;

  @ApiPropertyOptional({ description: 'Minimum qualification' })
  @IsOptional()
  @IsString()
  minimum_qualification?: string;

  @ApiPropertyOptional({ description: 'Preferred qualification' })
  @IsOptional()
  @IsString()
  preferred_qualification?: string;

  @ApiPropertyOptional({ description: 'Professional body registration' })
  @IsOptional()
  @IsString()
  professional_body_registration?: string;

  @ApiPropertyOptional({ description: 'Knowledge required' })
  @IsOptional()
  @IsString()
  knowledge?: string;
}

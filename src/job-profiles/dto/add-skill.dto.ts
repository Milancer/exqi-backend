import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddSkillDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  skill_name: string;

  @ApiProperty({ example: 3, description: 'Required proficiency level (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_critical?: boolean;
}

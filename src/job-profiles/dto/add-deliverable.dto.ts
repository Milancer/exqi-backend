import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddDeliverableDto {
  @ApiProperty({ example: 'Develop and maintain core platform features' })
  @IsString()
  deliverable: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Key Performance Area (short headline)' })
  @IsOptional()
  @IsString()
  kpa?: string;

  @ApiPropertyOptional({ description: 'KPIs (one per line)' })
  @IsOptional()
  @IsString()
  kpis?: string;

  @ApiPropertyOptional({ description: 'Responsibilities (one per line)' })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiPropertyOptional({ description: 'Relative weight 0–100' })
  @IsOptional()
  @IsNumber()
  weight?: number;
}

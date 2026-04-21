import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDeliverableDto {
  @ApiPropertyOptional({ description: 'Short deliverable text (legacy / fallback)' })
  @IsOptional()
  @IsString()
  deliverable?: string;

  @ApiPropertyOptional({ description: 'Display order within the profile' })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Key Performance Area (headline)' })
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

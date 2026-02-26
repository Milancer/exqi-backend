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
}

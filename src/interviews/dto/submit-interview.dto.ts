import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResponseItemDto {
  @ApiProperty()
  @IsNumber()
  question_id: number;

  @ApiProperty()
  @IsNumber()
  competency_id: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  behavioral_flags?: {
    paste_detected?: boolean;
    time_spent_seconds?: number;
    keystroke_count?: number;
    focus_lost_count?: number;
  };
}

export class SubmitInterviewDto {
  @ApiProperty({ type: [ResponseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseItemDto)
  responses: ResponseItemDto[];
}

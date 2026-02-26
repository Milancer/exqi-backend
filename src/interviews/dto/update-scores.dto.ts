import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateScoreItemDto {
  @ApiProperty()
  @IsNumber()
  response_id: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdateScoresDto {
  @ApiProperty({ type: [UpdateScoreItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScoreItemDto)
  scores: UpdateScoreItemDto[];
}

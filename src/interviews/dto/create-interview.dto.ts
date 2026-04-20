import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({ description: 'Candidate ID' })
  @IsNumber()
  candidate_id: number;

  @ApiProperty({ description: 'CBI Template ID' })
  @IsNumber()
  cbi_template_id: number;

  @ApiProperty({ description: 'User ID of the interviewer (Office Manager)' })
  @IsNumber()
  interviewer_id: number;

  @ApiPropertyOptional({
    description:
      'Optional explicit list of competency_question_ids to use for this interview. ' +
      'Must be a subset of the questions resolvable from the template. If omitted, ' +
      'the full template question set is used.',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  selected_question_ids?: number[];

  @ApiPropertyOptional({
    description: 'Hours until the link expires (default 48)',
  })
  @IsOptional()
  @IsNumber()
  expires_in_hours?: number;
}

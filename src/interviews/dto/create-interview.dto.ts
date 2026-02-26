import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

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
    description: 'Hours until the link expires (default 48)',
  })
  @IsOptional()
  @IsNumber()
  expires_in_hours?: number;
}

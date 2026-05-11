import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  // Candidates are no longer sent online interview links — the interviewer
  // downloads a PDF and prints it. Email is therefore optional and is NOT
  // format-validated (some clients only have partial contact info).
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Position/role the candidate is applying for' })
  @IsString()
  position: string;
}

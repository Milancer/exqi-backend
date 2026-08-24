import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  // Trimming and the empty check happen in the service, not via @Transform:
  // the global ValidationPipe runs without `transform: true`, so a
  // @Transform here would be validated but discarded before the controller
  // ever sees it.
  @ApiProperty({ example: 'Finance' })
  @IsString()
  @MaxLength(255)
  department: string;
}

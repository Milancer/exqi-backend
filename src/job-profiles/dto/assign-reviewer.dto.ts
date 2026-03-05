import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignReviewerDto {
  @ApiProperty({
    description: 'User ID of the OFFICE_MANAGER to assign as reviewer',
  })
  @IsNumber()
  reviewer_id: number;
}

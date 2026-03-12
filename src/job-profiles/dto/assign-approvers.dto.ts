import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignApproversDto {
  @ApiProperty({
    description: 'Array of user IDs to assign as approvers',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  approver_ids: number[];
}

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import { CreateJobProfileDto } from './create-job-profile.dto';

export class UpdateJobProfileDto extends PartialType(CreateJobProfileDto) {
  /**
   * Replace the Job Profile's Business Process selection with the given
   * leaf-most node ids (typically Procedures, but Sub-Processes are also
   * allowed if the user stops at that level). Pass an empty array to clear.
   *
   * Group-level node ids are rejected — Groups are derived via the parent chain.
   */
  @ApiPropertyOptional({ type: [Number], example: [1234, 1235, 1236] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  business_process_node_ids?: number[];
}

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJobProfileDto } from './create-job-profile.dto';

/**
 * One Business Process node selection on a Job Profile, with optional
 * RACI flags. All four booleans default to false on the entity, so omitting
 * them is equivalent to "no RACI tag yet".
 */
export class BusinessProcessSelectionDto {
  @ApiPropertyOptional({ example: 1234 })
  @IsInt()
  node_id: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_responsible?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_accountable?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_consulted?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_informed?: boolean;
}

export class UpdateJobProfileDto extends PartialType(CreateJobProfileDto) {
  /**
   * Replace the Job Profile's Business Process selection with the given
   * leaf-most node ids. Pass an empty array to clear.
   *
   * Group-level node ids are rejected — Groups are derived via the parent chain.
   *
   * Legacy field — prefer `business_processes` (which carries RACI flags) for
   * new clients. When both are provided, `business_processes` wins.
   */
  @ApiPropertyOptional({ type: [Number], example: [1234, 1235, 1236] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  business_process_node_ids?: number[];

  /**
   * Replace the Job Profile's Business Process selection with the given
   * leaf-most nodes including RACI flags. Same Group-level rejection rule.
   */
  @ApiPropertyOptional({ type: [BusinessProcessSelectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessProcessSelectionDto)
  business_processes?: BusinessProcessSelectionDto[];
}

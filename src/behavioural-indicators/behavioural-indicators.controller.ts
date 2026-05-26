import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BehaviouralIndicatorsService } from './behavioural-indicators.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('behavioural-indicators')
@ApiBearerAuth()
@Controller('behavioural-indicators')
@UseGuards(JwtAuthGuard)
export class BehaviouralIndicatorsController {
  constructor(private readonly service: BehaviouralIndicatorsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all CBI behavioural indicator competencies with their 5 proficiency levels',
  })
  findAll() {
    return this.service.findAll();
  }
}

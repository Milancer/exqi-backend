import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkLevelsService } from './work-levels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('work-levels')
@ApiBearerAuth()
@Controller('work-levels')
@UseGuards(JwtAuthGuard)
export class WorkLevelsController {
  constructor(private readonly workLevelsService: WorkLevelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active work levels' })
  findAll() {
    return this.workLevelsService.findAll();
  }
}

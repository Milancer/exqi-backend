import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JobGradesService } from './job-grades.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('job-grades')
@ApiBearerAuth()
@Controller('job-grades')
@UseGuards(JwtAuthGuard)
export class JobGradesController {
  constructor(private readonly jobGradesService: JobGradesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all job grades' })
  findAll() {
    return this.jobGradesService.findAll();
  }
}

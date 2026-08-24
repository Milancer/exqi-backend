import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active departments for the current client' })
  findAll(@Request() req) {
    return this.departmentsService.findAll(req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a department for the current client' })
  @ApiResponse({
    status: 201,
    description:
      'The created department, or the existing one if a department with that name already exists for this client',
  })
  create(@Body() dto: CreateDepartmentDto, @Request() req) {
    return this.departmentsService.create(dto, req.user);
  }
}

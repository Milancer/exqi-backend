import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { CreateCompetencyTypeDto } from './dto/competency-type/create-competency-type.dto';
import { UpdateCompetencyTypeDto } from './dto/competency-type/update-competency-type.dto';
import { CreateCompetencyClusterDto } from './dto/competency-cluster/create-competency-cluster.dto';
import { UpdateCompetencyClusterDto } from './dto/competency-cluster/update-competency-cluster.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Competencies')
@ApiBearerAuth()
@Controller('competencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  // ─── CompetencyType endpoints (MUST be before :id routes) ───

  @Post('types')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a competency type (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Type created successfully' })
  createType(@Body() dto: CreateCompetencyTypeDto, @Request() req) {
    return this.competenciesService.createType(dto, req.user);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all competency types' })
  @ApiResponse({ status: 200, description: 'List of types' })
  findAllTypes() {
    return this.competenciesService.findAllTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get competency type by ID' })
  @ApiResponse({ status: 200, description: 'Type found' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  findOneType(@Param('id') id: string) {
    return this.competenciesService.findOneType(+id);
  }

  @Patch('types/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a competency type (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Type updated successfully' })
  updateType(
    @Param('id') id: string,
    @Body() dto: UpdateCompetencyTypeDto,
    @Request() req,
  ) {
    return this.competenciesService.updateType(+id, dto, req.user);
  }

  @Delete('types/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a competency type (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Type deleted successfully' })
  removeType(@Param('id') id: string, @Request() req) {
    return this.competenciesService.removeType(+id, req.user);
  }

  // ─── CompetencyCluster endpoints (MUST be before :id routes) ───

  @Post('clusters')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a competency cluster (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Cluster created successfully' })
  createCluster(@Body() dto: CreateCompetencyClusterDto, @Request() req) {
    return this.competenciesService.createCluster(dto, req.user);
  }

  @Get('clusters')
  @ApiOperation({ summary: 'Get all competency clusters' })
  @ApiResponse({ status: 200, description: 'List of clusters' })
  findAllClusters() {
    return this.competenciesService.findAllClusters();
  }

  @Get('clusters/:id')
  @ApiOperation({ summary: 'Get competency cluster by ID' })
  @ApiResponse({ status: 200, description: 'Cluster found' })
  @ApiResponse({ status: 404, description: 'Cluster not found' })
  findOneCluster(@Param('id') id: string) {
    return this.competenciesService.findOneCluster(+id);
  }

  @Patch('clusters/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a competency cluster (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Cluster updated successfully' })
  updateCluster(
    @Param('id') id: string,
    @Body() dto: UpdateCompetencyClusterDto,
    @Request() req,
  ) {
    return this.competenciesService.updateCluster(+id, dto, req.user);
  }

  @Delete('clusters/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a competency cluster (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Cluster deleted successfully' })
  removeCluster(@Param('id') id: string, @Request() req) {
    return this.competenciesService.removeCluster(+id, req.user);
  }

  // ─── Competency endpoints (generic :id routes LAST) ───

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new competency (ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'Competency created successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
  create(@Body() createCompetencyDto: CreateCompetencyDto, @Request() req) {
    return this.competenciesService.create(createCompetencyDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all competencies' })
  @ApiResponse({
    status: 200,
    description: 'List of competencies',
  })
  findAll(@Request() req) {
    return this.competenciesService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get competency by ID' })
  @ApiResponse({
    status: 200,
    description: 'Competency found',
  })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.competenciesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a competency (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Competency updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  update(
    @Param('id') id: string,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
    @Request() req,
  ) {
    return this.competenciesService.update(+id, updateCompetencyDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a competency (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Competency deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Competency not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.competenciesService.remove(+id, req.user);
  }
}

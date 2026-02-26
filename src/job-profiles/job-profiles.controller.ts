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
import { JobProfilesService } from './job-profiles.service';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';
import { AddCompetencyDto } from './dto/add-competency.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { AddDeliverableDto } from './dto/add-deliverable.dto';
import { UpdateRequirementsDto } from './dto/update-requirements.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('job-profiles')
@ApiBearerAuth()
@Controller('job-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobProfilesController {
  constructor(private readonly jobProfilesService: JobProfilesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({
    summary: 'Create a new job profile (ADMIN or OFFICE_MANAGER)',
  })
  @ApiResponse({ status: 201, description: 'Job profile created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateJobProfileDto, @Request() req) {
    return this.jobProfilesService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job profiles' })
  @ApiResponse({ status: 200, description: 'Return all job profiles' })
  findAll(@Request() req) {
    return this.jobProfilesService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job profile by ID' })
  @ApiResponse({ status: 200, description: 'Return job profile' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update a job profile (ADMIN or OFFICE_MANAGER)' })
  @ApiResponse({ status: 200, description: 'Job profile updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateJobProfileDto,
    @Request() req,
  ) {
    return this.jobProfilesService.update(+id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({
    summary: 'Delete a job profile (ADMIN or OFFICE_MANAGER, soft delete)',
  })
  @ApiResponse({ status: 200, description: 'Job profile deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.remove(+id, req.user);
  }

  @Post(':id/competencies')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Add competency to job profile' })
  @ApiResponse({ status: 201, description: 'Competency added successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  addCompetency(
    @Param('id') id: string,
    @Body() dto: AddCompetencyDto,
    @Request() req,
  ) {
    return this.jobProfilesService.addCompetency(+id, dto, req.user);
  }

  @Delete(':id/competencies/:competencyId')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Remove competency from job profile' })
  @ApiResponse({ status: 200, description: 'Competency removed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeCompetency(
    @Param('id') id: string,
    @Param('competencyId') competencyId: string,
    @Request() req,
  ) {
    return this.jobProfilesService.removeCompetency(
      +id,
      +competencyId,
      req.user,
    );
  }

  @Post(':id/skills')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Add skill to job profile' })
  @ApiResponse({ status: 201, description: 'Skill added successfully' })
  addSkill(@Param('id') id: string, @Body() dto: AddSkillDto, @Request() req) {
    return this.jobProfilesService.addSkill(+id, dto, req.user);
  }

  @Delete(':id/skills/:skillId')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Remove skill from job profile' })
  @ApiResponse({ status: 200, description: 'Skill removed successfully' })
  removeSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Request() req,
  ) {
    return this.jobProfilesService.removeSkill(+id, +skillId, req.user);
  }

  @Post(':id/deliverables')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Add deliverable to job profile' })
  @ApiResponse({ status: 201, description: 'Deliverable added successfully' })
  addDeliverable(
    @Param('id') id: string,
    @Body() dto: AddDeliverableDto,
    @Request() req,
  ) {
    return this.jobProfilesService.addDeliverable(+id, dto, req.user);
  }

  @Delete(':id/deliverables/:deliverableId')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Remove deliverable from job profile' })
  @ApiResponse({ status: 200, description: 'Deliverable removed successfully' })
  removeDeliverable(
    @Param('id') id: string,
    @Param('deliverableId') deliverableId: string,
    @Request() req,
  ) {
    return this.jobProfilesService.removeDeliverable(
      +id,
      +deliverableId,
      req.user,
    );
  }

  @Patch(':id/requirements')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update job profile requirements' })
  @ApiResponse({
    status: 200,
    description: 'Requirements updated successfully',
  })
  updateRequirements(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementsDto,
    @Request() req,
  ) {
    return this.jobProfilesService.updateRequirements(+id, dto, req.user);
  }
}

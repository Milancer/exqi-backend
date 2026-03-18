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
  Query,
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
import { CreateJpCompetencyTypeDto } from './dto/jp-competency-type/create-jp-competency-type.dto';
import { UpdateJpCompetencyTypeDto } from './dto/jp-competency-type/update-jp-competency-type.dto';
import { CreateJpCompetencyClusterDto } from './dto/jp-competency-cluster/create-jp-competency-cluster.dto';
import { UpdateJpCompetencyClusterDto } from './dto/jp-competency-cluster/update-jp-competency-cluster.dto';
import { CreateJpCompetencyDto } from './dto/jp-competency/create-jp-competency.dto';
import { UpdateJpCompetencyDto } from './dto/jp-competency/update-jp-competency.dto';
import { AssignReviewerDto } from './dto/assign-reviewer.dto';
import { AssignApproversDto } from './dto/assign-approvers.dto';
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

  // ─── JP Competency Types (MUST be before :id routes) ───────────

  @Post('competency-types')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a JP competency type (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'JP type created successfully' })
  createJpType(@Body() dto: CreateJpCompetencyTypeDto, @Request() req) {
    return this.jobProfilesService.createJpType(dto, req.user);
  }

  @Get('competency-types')
  @ApiOperation({ summary: 'Get all JP competency types' })
  @ApiResponse({ status: 200, description: 'List of JP types' })
  findAllJpTypes() {
    return this.jobProfilesService.findAllJpTypes();
  }

  @Get('competency-types/:id')
  @ApiOperation({ summary: 'Get JP competency type by ID' })
  @ApiResponse({ status: 200, description: 'JP type found' })
  @ApiResponse({ status: 404, description: 'JP type not found' })
  findOneJpType(@Param('id') id: string) {
    return this.jobProfilesService.findOneJpType(+id);
  }

  @Patch('competency-types/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a JP competency type (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'JP type updated successfully' })
  updateJpType(
    @Param('id') id: string,
    @Body() dto: UpdateJpCompetencyTypeDto,
    @Request() req,
  ) {
    return this.jobProfilesService.updateJpType(+id, dto, req.user);
  }

  @Delete('competency-types/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a JP competency type (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'JP type deleted successfully' })
  removeJpType(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.removeJpType(+id, req.user);
  }

  // ─── JP Competency Clusters (MUST be before :id routes) ────────

  @Post('competency-clusters')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a JP competency cluster (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'JP cluster created successfully' })
  createJpCluster(@Body() dto: CreateJpCompetencyClusterDto, @Request() req) {
    return this.jobProfilesService.createJpCluster(dto, req.user);
  }

  @Get('competency-clusters')
  @ApiOperation({ summary: 'Get all JP competency clusters' })
  @ApiResponse({ status: 200, description: 'List of JP clusters' })
  findAllJpClusters() {
    return this.jobProfilesService.findAllJpClusters();
  }

  @Get('competency-clusters/:id')
  @ApiOperation({ summary: 'Get JP competency cluster by ID' })
  @ApiResponse({ status: 200, description: 'JP cluster found' })
  @ApiResponse({ status: 404, description: 'JP cluster not found' })
  findOneJpCluster(@Param('id') id: string) {
    return this.jobProfilesService.findOneJpCluster(+id);
  }

  @Patch('competency-clusters/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a JP competency cluster (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'JP cluster updated successfully' })
  updateJpCluster(
    @Param('id') id: string,
    @Body() dto: UpdateJpCompetencyClusterDto,
    @Request() req,
  ) {
    return this.jobProfilesService.updateJpCluster(+id, dto, req.user);
  }

  @Delete('competency-clusters/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a JP competency cluster (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'JP cluster deleted successfully' })
  removeJpCluster(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.removeJpCluster(+id, req.user);
  }

  // ─── JP Competencies (MUST be before :id routes) ───────────────

  @Post('competency-items')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a JP competency (ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'JP competency created successfully',
  })
  createJpCompetency(@Body() dto: CreateJpCompetencyDto, @Request() req) {
    return this.jobProfilesService.createJpCompetency(dto, req.user);
  }

  @Get('competency-items')
  @ApiOperation({ summary: 'Get all JP competencies' })
  @ApiResponse({ status: 200, description: 'List of JP competencies' })
  findAllJpCompetencies(@Request() req) {
    return this.jobProfilesService.findAllJpCompetencies(req.user);
  }

  @Get('competency-items/:id')
  @ApiOperation({ summary: 'Get JP competency by ID' })
  @ApiResponse({ status: 200, description: 'JP competency found' })
  @ApiResponse({ status: 404, description: 'JP competency not found' })
  findOneJpCompetency(@Param('id') id: string) {
    return this.jobProfilesService.findOneJpCompetency(+id);
  }

  @Patch('competency-items/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a JP competency (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'JP competency updated successfully',
  })
  updateJpCompetency(
    @Param('id') id: string,
    @Body() dto: UpdateJpCompetencyDto,
    @Request() req,
  ) {
    return this.jobProfilesService.updateJpCompetency(+id, dto, req.user);
  }

  @Delete('competency-items/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a JP competency (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'JP competency deleted successfully',
  })
  removeJpCompetency(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.removeJpCompetency(+id, req.user);
  }

  // ─── Reviewer workflow (MUST be before :id routes) ─────────────

  @Get('reviewer-candidates')
  @ApiOperation({
    summary: 'Get list of OFFICE_MANAGER users for reviewer selection',
  })
  @ApiResponse({ status: 200, description: 'List of reviewer candidates' })
  getReviewerCandidates(@Request() req) {
    return this.jobProfilesService.getReviewerCandidates(req.user);
  }

  // ─── Job Profile CRUD ──────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
  @ApiOperation({
    summary: 'Create a new job profile',
  })
  @ApiResponse({ status: 201, description: 'Job profile created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateJobProfileDto, @Request() req) {
    return this.jobProfilesService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job profiles with pagination and search' })
  @ApiResponse({ status: 200, description: 'Return paginated job profiles' })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('division') division?: string,
  ) {
    return this.jobProfilesService.findAll(req.user, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      status,
      division,
    });
  }

  @Get('divisions')
  @ApiOperation({ summary: 'Get all distinct divisions for filter dropdown' })
  @ApiResponse({ status: 200, description: 'List of divisions' })
  getDivisions(@Request() req) {
    return this.jobProfilesService.getDivisions(req.user);
  }

  @Get('dropdown-options')
  @ApiOperation({ summary: 'Get lightweight job profile list for dropdowns (id + title only)' })
  @ApiResponse({ status: 200, description: 'List of job profile options' })
  getDropdownOptions(@Request() req) {
    return this.jobProfilesService.getDropdownOptions(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job profile by ID' })
  @ApiResponse({ status: 200, description: 'Return job profile' })
  @ApiResponse({ status: 404, description: 'Job profile not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.jobProfilesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
  @ApiOperation({ summary: 'Update a job profile' })
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
  @ApiOperation({ summary: 'Add skill to job profile' })
  @ApiResponse({ status: 201, description: 'Skill added successfully' })
  addSkill(@Param('id') id: string, @Body() dto: AddSkillDto, @Request() req) {
    return this.jobProfilesService.addSkill(+id, dto, req.user);
  }

  @Delete(':id/skills/:skillId')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
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

  // ─── Reviewer assignment & review ───────────────────────────────

  @Post(':id/assign-reviewer')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
  @ApiOperation({
    summary: 'Assign an OFFICE_MANAGER as reviewer for a job profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviewer assigned, notification sent',
  })
  assignReviewer(
    @Param('id') id: string,
    @Body() dto: AssignReviewerDto,
    @Request() req,
  ) {
    return this.jobProfilesService.assignReviewer(
      +id,
      dto.reviewer_id,
      req.user,
    );
  }

  @Post(':id/review')
  @Roles(UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Approve or reject a job profile (reviewer only)' })
  @ApiResponse({ status: 200, description: 'Review action processed' })
  reviewJobProfile(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'reject' },
    @Request() req,
  ) {
    return this.jobProfilesService.reviewJobProfile(+id, body.action, req.user);
  }

  // ─── Multi-Approver endpoints ─────────────────────────────────

  @Post(':id/assign-approvers')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER, UserRole.OFFICE_USER)
  @ApiOperation({
    summary: 'Assign multiple approvers to a job profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Approvers assigned, notifications sent',
  })
  assignApprovers(
    @Param('id') id: string,
    @Body() dto: AssignApproversDto,
    @Request() req,
  ) {
    return this.jobProfilesService.assignApprovers(
      +id,
      dto.approver_ids,
      req.user,
    );
  }

  @Post(':id/approver-action')
  @Roles(UserRole.OFFICE_MANAGER)
  @ApiOperation({
    summary:
      'Individual approver approves or rejects a job profile',
  })
  @ApiResponse({ status: 200, description: 'Approver action processed' })
  approverAction(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'reject' },
    @Request() req,
  ) {
    return this.jobProfilesService.approverAction(+id, body.action, req.user);
  }
}

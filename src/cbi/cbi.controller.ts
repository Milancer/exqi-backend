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
import { CbiService } from './cbi.service';
import { CreateCbiTemplateDto } from './dto/create-cbi-template.dto';
import { UpdateCbiTemplateDto } from './dto/update-cbi-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('cbi')
@ApiBearerAuth()
@Controller('cbi/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CbiController {
  constructor(private readonly cbiService: CbiService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new CBI template (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateCbiTemplateDto, @Request() req) {
    return this.cbiService.createTemplate(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CBI templates' })
  @ApiResponse({ status: 200, description: 'Return all templates' })
  findAll(@Request() req) {
    return this.cbiService.findAllTemplates(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CBI template by ID' })
  @ApiResponse({ status: 200, description: 'Return template' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.cbiService.findOneTemplate(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a CBI template (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCbiTemplateDto,
    @Request() req,
  ) {
    return this.cbiService.updateTemplate(+id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a CBI template (ADMIN only, soft delete)' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.cbiService.removeTemplate(+id, req.user);
  }

  @Post(':id/generate-questions')
  @ApiOperation({
    summary: 'Generate questions from template competencies',
    description:
      'Automatically selects questions based on the competencies defined in the template',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions generated and added to template',
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  generateQuestions(@Param('id') id: string, @Request() req) {
    return this.cbiService.generateQuestionsFromTemplate(+id, req.user);
  }
}

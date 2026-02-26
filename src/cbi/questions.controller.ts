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
import { CbiService } from './cbi.service';
import { CreateCompetencyQuestionDto } from './dto/competency-question/create-competency-question.dto';
import { UpdateCompetencyQuestionDto } from './dto/competency-question/update-competency-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('cbi')
@ApiBearerAuth()
@Controller('cbi/questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionsController {
  constructor(private readonly cbiService: CbiService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Create a new question (ADMIN or OFFICE_MANAGER)' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateCompetencyQuestionDto, @Request() req) {
    return this.cbiService.createQuestion(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions (with optional filters)' })
  @ApiResponse({ status: 200, description: 'Return all questions' })
  @ApiQuery({ name: 'competencyId', required: false, type: Number })
  @ApiQuery({ name: 'level', required: false, type: Number })
  findAll(
    @Request() req,
    @Query('competencyId') competencyId?: number,
    @Query('level') level?: number,
  ) {
    return this.cbiService.findAllQuestions(
      req.user,
      competencyId ? +competencyId : undefined,
      level ? +level : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiResponse({ status: 200, description: 'Return question' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.cbiService.findOneQuestion(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update a question (ADMIN or OFFICE_MANAGER)' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompetencyQuestionDto,
    @Request() req,
  ) {
    return this.cbiService.updateQuestion(+id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({
    summary: 'Delete a question (ADMIN or OFFICE_MANAGER, soft delete)',
  })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.cbiService.removeQuestion(+id, req.user);
  }
}

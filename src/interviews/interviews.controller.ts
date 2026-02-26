import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitInterviewDto } from './dto/submit-interview.dto';
import { UpdateScoresDto } from './dto/update-scores.dto';
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

@ApiTags('interviews')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly service: InterviewsService) {}

  /* ───── Authenticated endpoints ───── */

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new interview session' })
  @ApiResponse({
    status: 201,
    description: 'Session created with shareable link',
  })
  create(@Body() dto: CreateInterviewDto, @Request() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all interview sessions' })
  findAll(@Request() req) {
    return this.service.findAll(req.user);
  }

  /* ───── Public (token-based) endpoints ───── */
  /* These MUST be defined BEFORE :id routes to avoid NestJS matching "public" as an :id */

  @Get('public/:token')
  @ApiOperation({
    summary: 'Get interview form data by token (no auth required)',
  })
  @ApiResponse({ status: 200, description: 'Interview form data' })
  @ApiResponse({
    status: 400,
    description: 'Link expired or already completed',
  })
  getByToken(@Param('token') token: string) {
    return this.service.getByToken(token);
  }

  @Post('public/:token/submit')
  @ApiOperation({
    summary: 'Submit interview responses by token (no auth required)',
  })
  @ApiResponse({ status: 201, description: 'Interview submitted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Link expired or already completed',
  })
  submitByToken(
    @Param('token') token: string,
    @Body() dto: SubmitInterviewDto,
  ) {
    return this.service.submitByToken(token, dto);
  }

  /* ───── Parameterized authenticated endpoints ───── */

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get interview session by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(+id, req.user);
  }

  @Get(':id/responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all responses for an interview session' })
  getResponses(@Param('id') id: string, @Request() req) {
    return this.service.getResponses(+id, req.user);
  }

  @Patch(':id/score')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update scores for an interview session' })
  async updateScores(
    @Param('id') id: string,
    @Body() dto: UpdateScoresDto,
    @Request() req,
  ) {
    return this.service.updateScores(+id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an interview session' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.service.cancel(+id, req.user);
  }
}

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessProcessesService } from './business-processes.service';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Business Processes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business-processes')
export class BusinessProcessesController {
  constructor(
    private readonly service: BusinessProcessesService,
  ) {}

  @Get('groups')
  @ApiOperation({ summary: 'List the three Group nodes (Enterprise / Core / Support)' })
  async listGroups() {
    return this.service.getGroups();
  }

  @Get('tree')
  @ApiOperation({
    summary: 'Return the catalogue tree, optionally filtered to one Group',
  })
  @ApiQuery({ name: 'group', required: false, example: 'Enterprise' })
  async getTree(@Query('group') group?: string) {
    return this.service.getTree(group);
  }

  @Post('import')
  @ApiOperation({
    summary: 'ADMIN-only: re-seed the BP catalogue from a workbook on disk',
  })
  async import(
    @Body() body: { filePath?: string },
    @Req() req: any,
  ) {
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can re-seed the catalogue');
    }
    if (!body?.filePath) {
      throw new BadRequestException('filePath is required');
    }
    return this.service.importFromWorkbookFile(body.filePath, req.user);
  }
}

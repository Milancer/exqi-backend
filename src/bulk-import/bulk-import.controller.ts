import {
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { BulkImportService } from './bulk-import.service';

@ApiTags('Bulk Import')
@Controller('bulk-import')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BulkImportController {
  constructor(private readonly bulkImportService: BulkImportService) {}

  @Get('template')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Download competency import template (ADMIN)' })
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.bulkImportService.generateTemplate();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="competency_import_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('preview')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Preview import data without saving (ADMIN)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async preview(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.bulkImportService.preview(file.buffer);
  }

  @Post('import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import competency data from Excel (ADMIN)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        target: { type: 'string', enum: ['jp', 'cbi'] },
      },
    },
  })
  async importData(
    @UploadedFile() file: Express.Multer.File,
    @Body('target') target: string,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!target || !['jp', 'cbi'].includes(target)) {
      throw new BadRequestException(
        'Target must be "jp" (Job Profile) or "cbi" (CBI Questions)',
      );
    }

    const clientId = req.user.clientId || 1;

    if (target === 'jp') {
      return this.bulkImportService.importToJp(file.buffer, clientId);
    } else {
      return this.bulkImportService.importToCbi(file.buffer, clientId);
    }
  }
}

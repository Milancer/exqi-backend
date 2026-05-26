import {
  Controller,
  Get,
  NotFoundException,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { BehaviouralIndicatorsService } from './behavioural-indicators.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const PDF_FILENAME = 'cbi-behavioural-indicators.pdf';
const PDF_DOWNLOAD_NAME = 'CBI Behavioural Indicators.pdf';

@ApiTags('behavioural-indicators')
@ApiBearerAuth()
@Controller('behavioural-indicators')
@UseGuards(JwtAuthGuard)
export class BehaviouralIndicatorsController {
  constructor(private readonly service: BehaviouralIndicatorsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all CBI behavioural indicator competencies with their 5 proficiency levels',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('pdf')
  @ApiOperation({
    summary: 'Download the source PDF (auth required)',
  })
  downloadPdf(): StreamableFile {
    const path = join(process.cwd(), 'assets', PDF_FILENAME);
    if (!existsSync(path)) {
      throw new NotFoundException(
        `PDF asset is missing on the server (expected at ${path}). ` +
          `Add it to the repo at assets/${PDF_FILENAME} and redeploy.`,
      );
    }
    return new StreamableFile(createReadStream(path), {
      type: 'application/pdf',
      disposition: `attachment; filename="${PDF_DOWNLOAD_NAME}"`,
    });
  }
}

/**
 * One-shot importer for the SITA "Business Process Hierarchy" workbook.
 *
 *   pnpm run import:business-processes
 *   pnpm run import:business-processes path/to/V49.xlsx
 *
 * Idempotent on `code`. Safe to re-run as Michael ships V49, V50, …
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { BusinessProcessesService } from './business-processes/business-processes.service';

const DEFAULT_PATH = path.resolve(
  __dirname,
  '..',
  'SITA_Business Process Hierarchy_ V48 17 April 2026.xlsx',
);

async function bootstrap() {
  const file = process.argv[2] ?? DEFAULT_PATH;
  console.log(`[bp-import] reading ${file}`);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const svc = app.get(BusinessProcessesService);
    const report = await svc.importFromWorkbookFilePublic(file);
    console.log('[bp-import] done');
    console.table({
      Groups: report.groupsUpserted,
      Processes: report.processesUpserted,
      'Sub-Processes': report.subProcessesUpserted,
      Procedures: report.proceduresUpserted,
      'Total nodes (DB)': report.totalNodesAfter,
      'Sheets skipped': report.skippedSheets.join(', '),
    });
  } finally {
    await app.close();
  }
}

bootstrap().catch((err) => {
  console.error('[bp-import] FAILED:', err);
  process.exit(1);
});

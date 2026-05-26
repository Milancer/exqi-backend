// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { BiCompetency } from './entities/bi-competency.entity';
import { BiLevel } from './entities/bi-level.entity';
import { BEHAVIOURAL_INDICATORS_SEED } from './seed-data';

/**
 * Seed the CBI Behavioural Indicators reference data.
 *
 * Usage: npm run seed:behavioural-indicators
 *
 * Wipes both tables and re-inserts from seed-data.ts each run, so editing the
 * seed file and re-running is the supported workflow.
 */
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const ds = app.get(DataSource);
  const compRepo = ds.getRepository(BiCompetency);
  const levelRepo = ds.getRepository(BiLevel);

  console.log('Wiping existing bi_levels and bi_competencies…');
  await levelRepo.delete({});
  await compRepo.delete({});

  console.log(`Inserting ${BEHAVIOURAL_INDICATORS_SEED.length} competencies…`);
  let levelCount = 0;
  for (const seed of BEHAVIOURAL_INDICATORS_SEED) {
    const comp = await compRepo.save(
      compRepo.create({
        category: seed.category,
        competency_name: seed.competency_name,
        description: seed.description,
        sort_order: seed.sort_order,
      }),
    );
    for (const lvl of seed.levels) {
      await levelRepo.save(
        levelRepo.create({
          bi_competency_id: comp.bi_competency_id,
          level: lvl.level,
          level_label: lvl.level_label,
          level_subtitle: lvl.level_subtitle,
          indicators: lvl.indicators,
        }),
      );
      levelCount++;
    }
    console.log(`  ✓ ${seed.competency_name} (${seed.levels.length} levels)`);
  }

  console.log(
    `\nDone. ${BEHAVIOURAL_INDICATORS_SEED.length} competencies, ${levelCount} levels inserted.`,
  );
  await app.close();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

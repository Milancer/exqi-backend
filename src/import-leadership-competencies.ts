// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CompetencyType } from './competencies/entities/competency-type.entity';
import { CompetencyCluster } from './competencies/entities/competency-cluster.entity';
import { Competency } from './competencies/entities/competency.entity';
import { CompetencyQuestion } from './cbi/entities/competency-question.entity';

/**
 * Import CBI Competencies from CSV into the database.
 *
 * Usage: npm run import:competencies -- <client_id> [csv_path]
 *   e.g. npm run import:competencies -- 2
 *        npm run import:competencies -- 2 "C:\path\to\file.csv"
 *
 * CSV structure:
 *   Type | Competency Cluster | Competency | Definition | 1-NOVICE | 2-DEVELOPING | 3-PROFICIENT | 4-HIGHLY PROFICIENT | 5-MASTERY
 *
 * - Row with Type + Cluster + Competency + Definition = new competency header
 * - Rows where level columns contain text with "?" = actual questions
 * - Other rows (sub-headings) are skipped
 */

const CSV_PATH =
  process.argv[3] ||
  path.join(
    'C:\\Users\\jonty\\Downloads',
    'Leadership Competencies 30 01 2026 - Sheet1.csv',
  );
const CLIENT_ID = parseInt(process.argv[2] || '2', 10);
const BATCH_SIZE = 50; // Insert questions in batches

// ── CSV parser (handles quoted fields with commas and newlines) ──
function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current.trim());
        current = '';
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        row.push(current.trim());
        current = '';
        if (row.length > 1 || row.some((c) => c !== '')) {
          rows.push(row);
        }
        row = [];
        if (ch === '\r') i++;
      } else {
        current += ch;
      }
    }
  }
  row.push(current.trim());
  if (row.length > 1 || row.some((c) => c !== '')) {
    rows.push(row);
  }
  return rows;
}

interface ParsedCompetency {
  typeName: string;
  clusterName: string;
  competencyName: string;
  definition: string;
  questions: { level: number; question: string }[];
}

function parseSpreadsheet(rows: string[][]): ParsedCompetency[] {
  const competencies: ParsedCompetency[] = [];
  let currentType = '';
  let currentCluster = '';
  let currentCompetency: ParsedCompetency | null = null;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const type = (row[0] || '').trim();
    const cluster = (row[1] || '').trim();
    const comp = (row[2] || '').trim();
    const def = (row[3] || '').trim();

    // New competency header row
    if (comp && def) {
      if (type) currentType = type;
      if (cluster) currentCluster = cluster;

      if (currentCompetency) {
        competencies.push(currentCompetency);
      }
      currentCompetency = {
        typeName: currentType,
        clusterName: currentCluster,
        competencyName: comp,
        definition: def,
        questions: [],
      };
      continue;
    }

    // Question rows — extract from level columns (indices 4-8)
    if (currentCompetency) {
      for (let lvl = 1; lvl <= 5; lvl++) {
        const cell = (row[3 + lvl] || '').trim();
        const cleaned = cell.replace(/^"+|"+$/g, '').trim();
        if (cleaned && cleaned.includes('?')) {
          currentCompetency.questions.push({ level: lvl, question: cleaned });
        }
      }
    }
  }
  if (currentCompetency) {
    competencies.push(currentCompetency);
  }

  return competencies;
}

async function run() {
  console.log('=== CBI Competencies Import ===');
  console.log(`Client ID: ${CLIENT_ID}`);
  console.log(`CSV: ${CSV_PATH}`);
  console.log(`Batch size: ${BATCH_SIZE}`);

  // Read & parse CSV
  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} CSV rows`);

  const parsed = parseSpreadsheet(rows);
  console.log(`Found ${parsed.length} competencies`);

  let totalQ = 0;
  for (const c of parsed) {
    console.log(
      `  [${c.clusterName}] ${c.competencyName}: ${c.questions.length} questions`,
    );
    totalQ += c.questions.length;
  }
  console.log(`Total questions to import: ${totalQ}\n`);

  // Connect to DB
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nexus',
    entities: [CompetencyType, CompetencyCluster, Competency, CompetencyQuestion],
    synchronize: false,
    ssl: (process.env.DB_HOST || '').includes('railway')
      ? { rejectUnauthorized: false }
      : false,
  });

  await dataSource.initialize();
  console.log('Database connected.');

  const typeRepo = dataSource.getRepository(CompetencyType);
  const clusterRepo = dataSource.getRepository(CompetencyCluster);
  const compRepo = dataSource.getRepository(Competency);
  const questionRepo = dataSource.getRepository(CompetencyQuestion);

  const typeCache = new Map<string, number>();
  const clusterCache = new Map<string, number>();
  const compCache = new Map<string, number>();

  let createdTypes = 0;
  let createdClusters = 0;
  let createdCompetencies = 0;
  let createdQuestions = 0;
  let skippedQuestions = 0;

  for (const entry of parsed) {
    // ── 1. Competency Type ──
    const typeKey = entry.typeName.toLowerCase();
    if (!typeCache.has(typeKey)) {
      let existing = await typeRepo.findOne({
        where: { competency_type: entry.typeName, client_id: CLIENT_ID },
      });
      if (!existing) {
        existing = await typeRepo.save(
          typeRepo.create({
            competency_type: entry.typeName,
            status: 'Active',
            client_id: CLIENT_ID,
          }),
        );
        createdTypes++;
        console.log(`  + Type: "${entry.typeName}" (id: ${existing.competency_type_id})`);
      } else {
        console.log(`  = Type: "${entry.typeName}" exists (id: ${existing.competency_type_id})`);
      }
      typeCache.set(typeKey, existing.competency_type_id);
    }
    const typeId = typeCache.get(typeKey)!;

    // ── 2. Competency Cluster ──
    const clusterKey = `${typeId}:${entry.clusterName.toLowerCase()}`;
    if (!clusterCache.has(clusterKey)) {
      let existing = await clusterRepo.findOne({
        where: {
          cluster_name: entry.clusterName,
          competency_type_id: typeId,
          client_id: CLIENT_ID,
        },
      });
      if (!existing) {
        existing = await clusterRepo.save(
          clusterRepo.create({
            cluster_name: entry.clusterName,
            competency_type_id: typeId,
            status: 'Active',
            client_id: CLIENT_ID,
          }),
        );
        createdClusters++;
        console.log(`  + Cluster: "${entry.clusterName}" (id: ${existing.competency_cluster_id})`);
      } else {
        console.log(`  = Cluster: "${entry.clusterName}" exists (id: ${existing.competency_cluster_id})`);
      }
      clusterCache.set(clusterKey, existing.competency_cluster_id);
    }
    const clusterId = clusterCache.get(clusterKey)!;

    // ── 3. Competency ──
    const compKey = `${typeId}:${clusterId}:${entry.competencyName.toLowerCase()}`;
    if (!compCache.has(compKey)) {
      let existing = await compRepo.findOne({
        where: {
          competency: entry.competencyName,
          competency_type_id: typeId,
          competency_cluster_id: clusterId,
          client_id: CLIENT_ID,
        },
      });
      if (!existing) {
        existing = await compRepo.save(
          compRepo.create({
            competency: entry.competencyName,
            description: entry.definition,
            competency_type_id: typeId,
            competency_cluster_id: clusterId,
            status: 'Active',
            client_id: CLIENT_ID,
          }),
        );
        createdCompetencies++;
        console.log(`  + Competency: "${entry.competencyName}" (id: ${existing.competency_id})`);
      } else {
        console.log(`  = Competency: "${entry.competencyName}" exists (id: ${existing.competency_id})`);
      }
      compCache.set(compKey, existing.competency_id);
    }
    const competencyId = compCache.get(compKey)!;

    // ── 4. Questions (batch insert) ──
    // First check which questions already exist
    const existingQuestions = await questionRepo.find({
      where: { competency_id: competencyId, client_id: CLIENT_ID },
      select: ['question', 'level'],
    });
    const existingSet = new Set(
      existingQuestions.map((q) => `${q.level}:${q.question}`),
    );

    const newQuestions = entry.questions.filter(
      (q) => !existingSet.has(`${q.level}:${q.question}`),
    );
    skippedQuestions += entry.questions.length - newQuestions.length;

    // Batch insert
    for (let i = 0; i < newQuestions.length; i += BATCH_SIZE) {
      const batch = newQuestions.slice(i, i + BATCH_SIZE);
      const entities = batch.map((q) =>
        questionRepo.create({
          competency_id: competencyId,
          level: q.level,
          question: q.question,
          status: 'Active',
          client_id: CLIENT_ID,
        }),
      );
      await questionRepo.save(entities);
      createdQuestions += batch.length;
    }
    console.log(
      `    -> ${newQuestions.length} new, ${entry.questions.length - newQuestions.length} skipped for "${entry.competencyName}"`,
    );
  }

  console.log('\n=== Import Summary ===');
  console.log(`Types created:        ${createdTypes}`);
  console.log(`Clusters created:     ${createdClusters}`);
  console.log(`Competencies created: ${createdCompetencies}`);
  console.log(`Questions created:    ${createdQuestions}`);
  console.log(`Questions skipped:    ${skippedQuestions} (duplicates)`);
  console.log('Done!');

  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});

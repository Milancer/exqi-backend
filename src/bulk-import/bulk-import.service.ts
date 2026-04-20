import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';

// JP entities
import { JpCompetencyType } from '../job-profiles/entities/jp-competency-type.entity';
import { JpCompetencyCluster } from '../job-profiles/entities/jp-competency-cluster.entity';
import { JpCompetency } from '../job-profiles/entities/jp-competency.entity';

// CBI entities
import { CompetencyType } from '../competencies/entities/competency-type.entity';
import { CompetencyCluster } from '../competencies/entities/competency-cluster.entity';
import { Competency } from '../competencies/entities/competency.entity';
import { CompetencyQuestion } from '../cbi/entities/competency-question.entity';

interface ParsedRow {
  type: string;
  cluster: string;
  competency: string;
  definition: string;
  level: number;
  question: string;
}

export interface ImportResult {
  types: number;
  clusters: number;
  competencies: number;
  questions: number;
  skippedRows: number;
}

@Injectable()
export class BulkImportService {
  constructor(
    // JP repos
    @InjectRepository(JpCompetencyType)
    private readonly jpTypeRepo: Repository<JpCompetencyType>,
    @InjectRepository(JpCompetencyCluster)
    private readonly jpClusterRepo: Repository<JpCompetencyCluster>,
    @InjectRepository(JpCompetency)
    private readonly jpCompRepo: Repository<JpCompetency>,

    // CBI repos
    @InjectRepository(CompetencyType)
    private readonly cbiTypeRepo: Repository<CompetencyType>,
    @InjectRepository(CompetencyCluster)
    private readonly cbiClusterRepo: Repository<CompetencyCluster>,
    @InjectRepository(Competency)
    private readonly cbiCompRepo: Repository<Competency>,
    @InjectRepository(CompetencyQuestion)
    private readonly cbiQuestionRepo: Repository<CompetencyQuestion>,
  ) {}

  // ─── Generate downloadable template ─────────────────────────
  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Competency Import');

    // Header row
    sheet.columns = [
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Cluster', key: 'cluster', width: 30 },
      { header: 'Competency', key: 'competency', width: 25 },
      { header: 'Definition', key: 'definition', width: 50 },
      { header: 'Level', key: 'level', width: 10 },
      { header: 'Question', key: 'question', width: 60 },
    ];

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A5F' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Example data
    const examples: Partial<ParsedRow>[] = [
      {
        type: 'Behavioural',
        cluster: 'Behavioural Cluster',
        competency: 'Active Listening',
        definition:
          'The ability to fully concentrate on what is being said rather than just passively hearing the message',
        level: 1,
        question:
          'Can you describe a time when you had to listen carefully to understand a situation?',
      },
      {
        type: 'Behavioural',
        cluster: 'Behavioural Cluster',
        competency: 'Active Listening',
        definition:
          'The ability to fully concentrate on what is being said rather than just passively hearing the message',
        level: 1,
        question:
          'Tell me about a situation where you felt it was important to pay close attention.',
      },
      {
        type: 'Behavioural',
        cluster: 'Behavioural Cluster',
        competency: 'Active Listening',
        definition:
          'The ability to fully concentrate on what is being said rather than just passively hearing the message',
        level: 2,
        question:
          'Can you describe a time when you had to interpret what someone really meant?',
      },
      {
        type: 'Behavioural',
        cluster: 'Behavioural Cluster',
        competency: 'Active Listening',
        definition:
          'The ability to fully concentrate on what is being said rather than just passively hearing the message',
        level: 3,
        question:
          'Can you provide an example where you used active listening to resolve a conflict?',
      },
      {
        type: 'Behavioural',
        cluster: 'Behavioural Cluster',
        competency: 'Empathy',
        definition:
          'The ability to understand and share the feelings of another person',
        level: 1,
        question:
          'Can you provide an example of a time when you showed empathy to a colleague?',
      },
      {
        type: 'Leadership',
        cluster: 'Customer Experience',
        competency: 'Customer Focus',
        definition:
          'Providing service excellence to internal and external customers',
        level: 1,
        question:
          'Can you describe a time when you used a digital tool to improve customer experience?',
      },
      {
        type: 'Leadership',
        cluster: 'Customer Experience',
        competency: 'Customer Focus',
        definition:
          'Providing service excellence to internal and external customers',
        level: 2,
        question:
          'How do you ensure customers or colleagues have a positive experience?',
      },
    ];

    examples.forEach((row) => sheet.addRow(row));

    // Instructions sheet
    const instrSheet = workbook.addWorksheet('Instructions');
    instrSheet.getColumn(1).width = 80;

    const instructions = [
      'COMPETENCY IMPORT TEMPLATE — INSTRUCTIONS',
      '',
      '1. Fill in data on the "Competency Import" sheet.',
      '2. Each row represents ONE question for a competency at a specific level.',
      '3. Repeat the Type, Cluster, Competency, and Definition on every row.',
      '   The importer deduplicates — it will create each Type/Cluster/Competency only once.',
      '4. Level must be a number from 1 to 5:',
      '   1 = Novice, 2 = Developing, 3 = Proficient, 4 = Highly Proficient, 5 = Mastery',
      '5. Each competency can have any number of questions per level.',
      '6. Do NOT include sub-headings or blank rows in the data.',
      '7. All 6 columns (Type, Cluster, Competency, Definition, Level, Question) are required.',
      '',
      'COLUMN REFERENCE:',
      '  A — Type: e.g., "Behavioural", "Leadership", "Technical"',
      '  B — Cluster: the competency cluster name',
      '  C — Competency: the competency name',
      '  D — Definition: description of the competency',
      '  E — Level: proficiency level (1-5)',
      '  F — Question: interview question text',
    ];

    instructions.forEach((line, i) => {
      const row = instrSheet.getRow(i + 1);
      row.getCell(1).value = line;
      if (i === 0) {
        row.font = { bold: true, size: 14 };
      }
    });

    return workbook.xlsx.writeBuffer() as any;
  }

  // ─── Parse Excel buffer into rows ───────────────────────────
  private async parseExcel(buffer: Buffer): Promise<ParsedRow[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw new BadRequestException('No worksheet found in the file');
    }

    const rows: ParsedRow[] = [];
    let skipped = 0;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const type = String(row.getCell(1).value || '').trim();
      const cluster = String(row.getCell(2).value || '').trim();
      const competency = String(row.getCell(3).value || '').trim();
      const definition = String(row.getCell(4).value || '').trim();
      const levelRaw = row.getCell(5).value;
      const question = String(row.getCell(6).value || '').trim();

      // Skip blank or incomplete rows
      if (!type || !cluster || !competency) {
        skipped++;
        return;
      }

      const level = Number(levelRaw);
      if (!level || level < 1 || level > 5) {
        skipped++;
        return;
      }

      if (!question) {
        skipped++;
        return;
      }

      rows.push({ type, cluster, competency, definition, level, question });
    });

    if (rows.length === 0) {
      throw new BadRequestException(
        `No valid data rows found (${skipped} rows skipped). Ensure the spreadsheet matches the template format.`,
      );
    }

    return rows;
  }

  // ─── Preview (parse + summarise without saving) ─────────────
  async preview(buffer: Buffer) {
    const rows = await this.parseExcel(buffer);

    // Group by type → cluster → competency
    const types = new Set<string>();
    const clusters = new Set<string>();
    const competencies = new Set<string>();

    rows.forEach((r) => {
      types.add(r.type);
      clusters.add(`${r.type}::${r.cluster}`);
      competencies.add(`${r.type}::${r.cluster}::${r.competency}`);
    });

    return {
      totalRows: rows.length,
      types: Array.from(types),
      clusters: Array.from(clusters).map((c) => c.split('::')[1]),
      competencies: Array.from(competencies).map((c) => c.split('::')[2]),
      typesCount: types.size,
      clustersCount: clusters.size,
      competenciesCount: competencies.size,
      questionsCount: rows.length,
    };
  }

  // ─── Import into JP competency tables ───────────────────────
  async importToJp(buffer: Buffer, clientId: number): Promise<ImportResult> {
    const rows = await this.parseExcel(buffer);

    const typeCache = new Map<string, number>(); // name → id
    const clusterCache = new Map<string, number>(); // "type::cluster" → id
    const compCache = new Map<string, number>(); // "type::cluster::comp" → id
    let questionsCount = 0;
    const skippedRows = 0;

    // Group questions by competency to build indicators
    const compQuestions = new Map<
      string,
      { definition: string; questions: { level: number; question: string }[] }
    >();

    for (const row of rows) {
      const compKey = `${row.type}::${row.cluster}::${row.competency}`;

      // Ensure type exists
      if (!typeCache.has(row.type)) {
        let existing = await this.jpTypeRepo.findOne({
          where: { competency_type: row.type, client_id: clientId },
        });
        if (!existing) {
          existing = await this.jpTypeRepo.save(
            this.jpTypeRepo.create({
              competency_type: row.type,
              client_id: clientId,
            }),
          );
        }
        typeCache.set(row.type, existing.jp_competency_type_id);
      }

      // Ensure cluster exists
      const clusterKey = `${row.type}::${row.cluster}`;
      if (!clusterCache.has(clusterKey)) {
        const typeId = typeCache.get(row.type)!;
        let existing = await this.jpClusterRepo.findOne({
          where: {
            cluster_name: row.cluster,
            jp_competency_type_id: typeId,
            client_id: clientId,
          },
        });
        if (!existing) {
          existing = await this.jpClusterRepo.save(
            this.jpClusterRepo.create({
              cluster_name: row.cluster,
              jp_competency_type_id: typeId,
              client_id: clientId,
            }),
          );
        }
        clusterCache.set(clusterKey, existing.jp_competency_cluster_id);
      }

      // Ensure competency exists
      if (!compCache.has(compKey)) {
        const typeId = typeCache.get(row.type)!;
        const clusterId = clusterCache.get(clusterKey)!;
        let existing = await this.jpCompRepo.findOne({
          where: {
            competency: row.competency,
            jp_competency_type_id: typeId,
            jp_competency_cluster_id: clusterId,
            client_id: clientId,
          },
        });
        if (!existing) {
          existing = await this.jpCompRepo.save(
            this.jpCompRepo.create({
              competency: row.competency,
              description: row.definition,
              jp_competency_type_id: typeId,
              jp_competency_cluster_id: clusterId,
              client_id: clientId,
            }),
          );
        }
        compCache.set(compKey, existing.jp_competency_id);
        compQuestions.set(compKey, {
          definition: row.definition,
          questions: [],
        });
      }

      // Collect questions for indicators
      compQuestions.get(compKey)!.questions.push({
        level: row.level,
        question: row.question,
      });
      questionsCount++;
    }

    // Update indicators field with grouped questions
    for (const [compKey, data] of compQuestions) {
      const compId = compCache.get(compKey)!;
      const grouped: Record<number, string[]> = {};
      for (const q of data.questions) {
        if (!grouped[q.level]) grouped[q.level] = [];
        grouped[q.level].push(q.question);
      }
      const indicators = Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(
          ([level, qs]) =>
            `Level ${level}:\n${qs.map((q) => `  • ${q}`).join('\n')}`,
        )
        .join('\n\n');

      await this.jpCompRepo.update(compId, { indicators });
    }

    return {
      types: typeCache.size,
      clusters: clusterCache.size,
      competencies: compCache.size,
      questions: questionsCount,
      skippedRows,
    };
  }

  // ─── Import into CBI competency tables ──────────────────────
  async importToCbi(buffer: Buffer, clientId: number): Promise<ImportResult> {
    const rows = await this.parseExcel(buffer);

    const typeCache = new Map<string, number>();
    const clusterCache = new Map<string, number>();
    const compCache = new Map<string, number>();
    let questionsCount = 0;
    const skippedRows = 0;

    for (const row of rows) {
      // Ensure type exists
      if (!typeCache.has(row.type)) {
        let existing = await this.cbiTypeRepo.findOne({
          where: { competency_type: row.type, client_id: clientId },
        });
        if (!existing) {
          existing = await this.cbiTypeRepo.save(
            this.cbiTypeRepo.create({
              competency_type: row.type,
              client_id: clientId,
            }),
          );
        }
        typeCache.set(row.type, existing.competency_type_id);
      }

      // Ensure cluster exists
      const clusterKey = `${row.type}::${row.cluster}`;
      if (!clusterCache.has(clusterKey)) {
        const typeId = typeCache.get(row.type)!;
        let existing = await this.cbiClusterRepo.findOne({
          where: {
            cluster_name: row.cluster,
            competency_type_id: typeId,
            client_id: clientId,
          },
        });
        if (!existing) {
          existing = await this.cbiClusterRepo.save(
            this.cbiClusterRepo.create({
              cluster_name: row.cluster,
              competency_type_id: typeId,
              client_id: clientId,
            }),
          );
        }
        clusterCache.set(clusterKey, existing.competency_cluster_id);
      }

      // Ensure competency exists
      const compKey = `${row.type}::${row.cluster}::${row.competency}`;
      if (!compCache.has(compKey)) {
        const typeId = typeCache.get(row.type)!;
        const clusterId = clusterCache.get(clusterKey)!;
        let existing = await this.cbiCompRepo.findOne({
          where: {
            competency: row.competency,
            competency_type_id: typeId,
            competency_cluster_id: clusterId,
            client_id: clientId,
          },
        });
        if (!existing) {
          existing = await this.cbiCompRepo.save(
            this.cbiCompRepo.create({
              competency: row.competency,
              description: row.definition,
              competency_type_id: typeId,
              competency_cluster_id: clusterId,
              client_id: clientId,
            }),
          );
        }
        compCache.set(compKey, existing.competency_id);
      }

      // Create question
      const compId = compCache.get(compKey)!;
      await this.cbiQuestionRepo.save(
        this.cbiQuestionRepo.create({
          competency_id: compId,
          level: row.level,
          question: row.question,
          client_id: clientId,
        }),
      );
      questionsCount++;
    }

    return {
      types: typeCache.size,
      clusters: clusterCache.size,
      competencies: compCache.size,
      questions: questionsCount,
      skippedRows,
    };
  }
}

/**
 * One-shot script: dump every Job Profile for the current client to a
 * human-readable .xlsx report in C:/Data/exqi-job-profiles.xlsx.
 *
 * Format (per profile):
 *   ┌──────────────────────────────────────────┐
 *   │ JOB PROFILE: <title>        [status]     │   ← colored band, merged cells
 *   ├──────────────────────────────────────────┤
 *   │ Field                 │ Value             │   ← profile metadata
 *   │ …                                         │
 *   │ DELIVERABLES                              │   ← section header
 *   │ # │ KPA │ KPIs │ Responsibilities │ Weight│
 *   │ …                                         │
 *   │ COMPETENCIES                              │
 *   │ …                                         │
 *   │ SKILLS                                    │
 *   │ …                                         │
 *   │ REQUIREMENTS                              │
 *   │ …                                         │
 *   └──────────────────────────────────────────┘
 *     (blank rows, then next profile)
 *
 * Usage:   pnpm run export:excel [clientId]
 * Default clientId = 2 (SITA).
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import ExcelJS from 'exceljs';

import { JobProfile } from './job-profiles/entities/job-profile.entity';
import { JobProfileCompetency } from './job-profiles/entities/job-profile-competency.entity';
import { JobProfileSkill } from './job-profiles/entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './job-profiles/entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './job-profiles/entities/job-profile-requirement.entity';
import { JobProfileApprover } from './job-profiles/entities/job-profile-approver.entity';
import { JpCompetencyType } from './job-profiles/entities/jp-competency-type.entity';
import { JpCompetencyCluster } from './job-profiles/entities/jp-competency-cluster.entity';
import { JpCompetency } from './job-profiles/entities/jp-competency.entity';
import { Skill } from './skills/entities/skill.entity';
import { User } from './users/entities/user.entity';
import { Client } from './clients/entities/client.entity';
import { Department } from './departments/entities/department.entity';
import { JobGrade } from './job-grades/entities/job-grade.entity';
import { WorkLevel } from './work-levels/entities/work-level.entity';

const CLIENT_ID = Number(process.argv[2]) || 2;
const OUT_DIR = 'C:/Data';
const OUT_FILE = path.join(OUT_DIR, 'exqi-job-profiles.xlsx');

/* ─── Colors + styling helpers ─── */
const BRAND = 'FF1A365D'; // navy
const BRAND_LIGHT = 'FFE9EEF7';
const ACCENT = 'FF2B4C7E';
const BORDER = 'FFB0BFD7';
const SECTION_BG = 'FFD6DFEE';
const META_LABEL_BG = 'FFF2F5FA';

function setTitleBar(
  ws: ExcelJS.Worksheet,
  row: number,
  text: string,
  subtitle = '',
) {
  ws.mergeCells(row, 1, row, 6);
  const cell = ws.getCell(row, 1);
  cell.value = subtitle ? `${text}    —    ${subtitle}` : text;
  cell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: BRAND },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 26;
}

function setSectionHeader(ws: ExcelJS.Worksheet, row: number, text: string) {
  ws.mergeCells(row, 1, row, 6);
  const cell = ws.getCell(row, 1);
  cell.value = text;
  cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: ACCENT },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 20;
}

function addKeyValue(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  value: string | number | null | undefined,
) {
  ws.mergeCells(row, 1, row, 2);
  ws.mergeCells(row, 3, row, 6);
  const lc = ws.getCell(row, 1);
  lc.value = label;
  lc.font = { bold: true, size: 10 };
  lc.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: META_LABEL_BG },
  };
  lc.alignment = { vertical: 'top', horizontal: 'left', indent: 1 };
  lc.border = { right: { style: 'thin', color: { argb: BORDER } } };

  const vc = ws.getCell(row, 3);
  vc.value = value === null || value === undefined || value === '' ? '—' : value;
  vc.font = { size: 10 };
  vc.alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };
}

function addTableHeader(
  ws: ExcelJS.Worksheet,
  row: number,
  headers: string[],
) {
  headers.forEach((h, i) => {
    const cell = ws.getCell(row, i + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: ACCENT },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    cell.border = { bottom: { style: 'thin', color: { argb: BORDER } } };
  });
  ws.getRow(row).height = 18;
}

function addTableRow(
  ws: ExcelJS.Worksheet,
  row: number,
  values: (string | number | null | undefined)[],
  zebra = false,
) {
  values.forEach((v, i) => {
    const cell = ws.getCell(row, i + 1);
    cell.value = v === null || v === undefined ? '' : v;
    cell.font = { size: 10 };
    cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };
    cell.border = {
      top: { style: 'hair', color: { argb: BORDER } },
      bottom: { style: 'hair', color: { argb: BORDER } },
      left: { style: 'hair', color: { argb: BORDER } },
      right: { style: 'hair', color: { argb: BORDER } },
    };
    if (zebra) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: BRAND_LIGHT },
      };
    }
  });
}

function addSubSectionLabel(ws: ExcelJS.Worksheet, row: number, text: string) {
  ws.mergeCells(row, 1, row, 6);
  const cell = ws.getCell(row, 1);
  cell.value = text;
  cell.font = { bold: true, size: 10, italic: true, color: { argb: BRAND } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: SECTION_BG },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
}

/* ─── Main ─── */
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n📊 Exporting job profiles for client_id=${CLIENT_ID}`);
  console.log(`   Target file: ${OUT_FILE}`);

  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nexus',
    entities: [
      JobProfile,
      JobProfileCompetency,
      JobProfileSkill,
      JobProfileDeliverable,
      JobProfileRequirement,
      JobProfileApprover,
      JpCompetencyType,
      JpCompetencyCluster,
      JpCompetency,
      Skill,
      User,
      Client,
      Department,
      JobGrade,
      WorkLevel,
    ],
    synchronize: false,
    ssl: false,
  });

  await ds.initialize();
  console.log('   DB connected.\n');

  // Load flat tables separately — avoids TypeORM's deep-relation join which
  // generates massive SQL that has been fragile under the current schema.
  console.log('   Loading profiles...');
  const profiles = await ds.getRepository(JobProfile).find({
    where: { client_id: CLIENT_ID },
    order: { job_title: 'ASC' },
  });
  const active = profiles.filter((p) => p.status !== 'Deleted');
  const activeIds = active.map((p) => p.job_profile_id);

  console.log(`   ${active.length} active profiles`);
  console.log('   Loading related data in parallel...');

  const [
    allDeliverables,
    allSkills,
    allJpCompetencies,
    allRequirements,
    allMasterSkills,
    allJpCompetencyDefs,
    allJpCompetencyTypes,
    allJpCompetencyClusters,
    allDepartments,
    allJobGrades,
    allWorkLevels,
  ] = await Promise.all([
    ds.getRepository(JobProfileDeliverable).find(),
    ds.getRepository(JobProfileSkill).find(),
    ds.getRepository(JobProfileCompetency).find(),
    ds.getRepository(JobProfileRequirement).find(),
    ds.getRepository(Skill).find(),
    ds.getRepository(JpCompetency).find(),
    ds.getRepository(JpCompetencyType).find(),
    ds.getRepository(JpCompetencyCluster).find(),
    ds.getRepository(Department).find(),
    ds.getRepository(JobGrade).find(),
    ds.getRepository(WorkLevel).find(),
  ]);

  console.log('   Indexing lookups...');

  // Index by job_profile_id
  const delsByJp = new Map<number, typeof allDeliverables>();
  for (const d of allDeliverables) {
    if (!activeIds.includes(d.job_profile_id)) continue;
    const arr = delsByJp.get(d.job_profile_id) ?? [];
    arr.push(d);
    delsByJp.set(d.job_profile_id, arr);
  }
  const skillsByJp = new Map<number, typeof allSkills>();
  for (const s of allSkills) {
    if (!activeIds.includes(s.job_profile_id)) continue;
    const arr = skillsByJp.get(s.job_profile_id) ?? [];
    arr.push(s);
    skillsByJp.set(s.job_profile_id, arr);
  }
  const jpCompsByJp = new Map<number, typeof allJpCompetencies>();
  for (const c of allJpCompetencies) {
    if (!activeIds.includes(c.job_profile_id)) continue;
    const arr = jpCompsByJp.get(c.job_profile_id) ?? [];
    arr.push(c);
    jpCompsByJp.set(c.job_profile_id, arr);
  }
  const reqByJp = new Map<number, typeof allRequirements[number]>();
  for (const r of allRequirements) {
    if (!activeIds.includes(r.job_profile_id)) continue;
    reqByJp.set(r.job_profile_id, r);
  }

  // Master lookups
  const skillById = new Map<number, typeof allMasterSkills[number]>();
  for (const s of allMasterSkills) skillById.set(s.skill_id, s);
  const jpCompDefById = new Map<number, typeof allJpCompetencyDefs[number]>();
  for (const c of allJpCompetencyDefs) jpCompDefById.set(c.jp_competency_id, c);
  const jpTypeById = new Map<number, string>();
  for (const t of allJpCompetencyTypes)
    jpTypeById.set(t.jp_competency_type_id, t.competency_type);
  const jpClusterById = new Map<number, string>();
  for (const c of allJpCompetencyClusters)
    jpClusterById.set(c.jp_competency_cluster_id, c.cluster_name);

  const deptMap = new Map<number, string>();
  for (const d of allDepartments) deptMap.set(d.department_id, d.department);
  const gradeMap = new Map<number, string>();
  for (const g of allJobGrades) gradeMap.set(g.job_grade_id, g.job_grade);
  const wlMap = new Map<number, string>();
  for (const w of allWorkLevels) wlMap.set(w.work_level_id, w.level_of_work);

  const titleById = new Map<number, string>();
  for (const p of profiles) titleById.set(p.job_profile_id, p.job_title);

  console.log(
    `   ✓ ${allDeliverables.length} deliverables, ${allSkills.length} skills, ` +
      `${allJpCompetencies.length} competency links, ${allRequirements.length} requirements\n`,
  );

  /* ─── Build the workbook ─── */
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EXQi Export';
  wb.created = new Date();

  const ws = wb.addWorksheet('Job Profiles', {
    views: [{ state: 'frozen', ySplit: 0 }],
  });
  // Fixed column widths tuned for readability
  ws.columns = [
    { width: 10 }, // #
    { width: 28 }, // KPA / Competency / Skill / label
    { width: 45 }, // KPIs / Description
    { width: 45 }, // Responsibilities / Indicators
    { width: 12 }, // Level
    { width: 12 }, // Weight / Flag
  ];

  let row = 1;

  // Workbook title
  ws.mergeCells(row, 1, row, 6);
  const title = ws.getCell(row, 1);
  title.value = `EXQi — Job Profiles Export    (client_id=${CLIENT_ID}    generated=${new Date().toLocaleString()})`;
  title.font = { bold: true, size: 16, color: { argb: BRAND } };
  title.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 28;
  row += 1;

  ws.mergeCells(row, 1, row, 6);
  const summary = ws.getCell(row, 1);
  summary.value = `${active.length} job profile(s) — each profile's full details (deliverables, competencies, skills, requirements) are grouped together below.`;
  summary.font = { size: 10, italic: true, color: { argb: 'FF666666' } };
  summary.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  row += 2; // blank line

  let processed = 0;
  for (const p of active) {
    processed += 1;
    if (processed % 50 === 0) {
      process.stdout.write(
        `\r   ✎ writing profile ${processed}/${active.length}...`,
      );
    }

    // ── Profile title bar ──
    setTitleBar(
      ws,
      row,
      `JOB PROFILE #${p.job_profile_id} — ${p.job_title || '(no title)'}`,
      p.status,
    );
    row += 1;

    // ── Profile metadata (key/value rows) ──
    addKeyValue(ws, row++, 'Job Title', p.job_title);
    addKeyValue(ws, row++, 'Job Purpose', p.job_purpose);
    addKeyValue(
      ws,
      row++,
      'Department',
      p.department_id ? deptMap.get(p.department_id) || '' : '',
    );
    addKeyValue(ws, row++, 'Division', p.division);
    addKeyValue(ws, row++, 'Job Family', p.job_family);
    addKeyValue(ws, row++, 'Job Location', p.job_location);
    addKeyValue(
      ws,
      row++,
      'Level of Work',
      p.level_of_work ? wlMap.get(p.level_of_work) || String(p.level_of_work) : '',
    );
    addKeyValue(
      ws,
      row++,
      'Job Grade',
      p.job_grade_id ? gradeMap.get(p.job_grade_id) || '' : '',
    );
    addKeyValue(
      ws,
      row++,
      'Reports To',
      p.reports_to ? titleById.get(p.reports_to) || `#${p.reports_to}` : '',
    );
    addKeyValue(ws, row++, 'Status', p.status);
    row += 1;

    // ── Deliverables ──
    setSectionHeader(ws, row++, 'KEY DELIVERABLES');
    const dels = (delsByJp.get(p.job_profile_id) || [])
      .filter((d) => d.status !== 'Inactive')
      .sort((a, b) => a.sequence - b.sequence);
    if (dels.length === 0) {
      ws.mergeCells(row, 1, row, 6);
      const c = ws.getCell(row, 1);
      c.value = 'No deliverables defined.';
      c.font = { size: 10, italic: true, color: { argb: 'FF999999' } };
      c.alignment = { horizontal: 'left', indent: 1 };
      row += 1;
    } else {
      addTableHeader(ws, row++, [
        '#',
        'KPA',
        'KPIs',
        'Responsibilities',
        'Weight',
        '',
      ]);
      dels.forEach((d, i) => {
        addTableRow(
          ws,
          row++,
          [
            i + 1,
            d.kpa || d.deliverable || '',
            d.kpis || '',
            d.responsibilities || '',
            d.weight ?? '',
            '',
          ],
          i % 2 === 1,
        );
      });
    }
    row += 1;

    // ── Competencies ──
    setSectionHeader(ws, row++, 'COMPETENCIES');
    const comps = jpCompsByJp.get(p.job_profile_id) || [];
    if (comps.length === 0) {
      ws.mergeCells(row, 1, row, 6);
      const c = ws.getCell(row, 1);
      c.value = 'No competencies assigned.';
      c.font = { size: 10, italic: true, color: { argb: 'FF999999' } };
      c.alignment = { horizontal: 'left', indent: 1 };
      row += 1;
    } else {
      addTableHeader(ws, row++, [
        '#',
        'Competency',
        'Type',
        'Cluster',
        'Level',
        'Flags',
      ]);
      comps.forEach((c, i) => {
        const def = jpCompDefById.get(c.jp_competency_id);
        const flags: string[] = [];
        if (c.is_critical) flags.push('Critical');
        if (c.is_differentiating) flags.push('Differentiating');
        addTableRow(
          ws,
          row++,
          [
            i + 1,
            def?.competency || '(unknown)',
            def ? jpTypeById.get(def.jp_competency_type_id) || '' : '',
            def ? jpClusterById.get(def.jp_competency_cluster_id) || '' : '',
            `L${c.level}`,
            flags.join(', '),
          ],
          i % 2 === 1,
        );
      });
    }
    row += 1;

    // ── Skills ──
    setSectionHeader(ws, row++, 'SKILLS');
    const skills = (skillsByJp.get(p.job_profile_id) || []).filter(
      (s) => s.status !== 'Inactive',
    );
    if (skills.length === 0) {
      ws.mergeCells(row, 1, row, 6);
      const c = ws.getCell(row, 1);
      c.value = 'No skills assigned.';
      c.font = { size: 10, italic: true, color: { argb: 'FF999999' } };
      c.alignment = { horizontal: 'left', indent: 1 };
      row += 1;
    } else {
      addTableHeader(ws, row++, [
        '#',
        'Skill',
        'Description',
        'Indicators',
        'Level',
        'Critical',
      ]);
      skills.forEach((sk, i) => {
        const master = sk.skill_id ? skillById.get(sk.skill_id) : undefined;
        let indicatorsText = '';
        const raw = master?.indicators;
        if (Array.isArray(raw)) {
          indicatorsText = raw.join('\n');
        } else if (typeof raw === 'string' && (raw as string).trim()) {
          try {
            const parsed = JSON.parse(raw as string);
            indicatorsText = Array.isArray(parsed)
              ? parsed.join('\n')
              : String(parsed);
          } catch {
            indicatorsText = raw as string;
          }
        }
        addTableRow(
          ws,
          row++,
          [
            i + 1,
            sk.skill_name || master?.skill || '',
            master?.description || '',
            indicatorsText,
            `L${sk.level}`,
            sk.is_critical ? 'Yes' : 'No',
          ],
          i % 2 === 1,
        );
      });
    }
    row += 1;

    // ── Requirements ──
    setSectionHeader(ws, row++, 'REQUIREMENTS');
    const r = reqByJp.get(p.job_profile_id);
    if (!r) {
      ws.mergeCells(row, 1, row, 6);
      const c = ws.getCell(row, 1);
      c.value = 'No requirements defined.';
      c.font = { size: 10, italic: true, color: { argb: 'FF999999' } };
      c.alignment = { horizontal: 'left', indent: 1 };
      row += 1;
    } else {
      addKeyValue(ws, row++, 'Minimum Qualification', r.minimum_qualification || r.education || '');
      addKeyValue(ws, row++, 'Preferred Qualification', r.preferred_qualification || '');
      addKeyValue(ws, row++, 'Work Experience', r.experience || '');
      addKeyValue(ws, row++, 'Certifications', r.certifications || '');
      addKeyValue(
        ws,
        row++,
        'Professional Body Registration',
        r.professional_body_registration || '',
      );
      addKeyValue(ws, row++, 'Knowledge', r.knowledge || '');
      addKeyValue(ws, row++, 'Other Requirements', r.other_requirements || '');
    }

    // Spacer rows between profiles
    row += 3;
  }
  process.stdout.write('\r'.padEnd(80) + '\r');
  console.log(`   ✅ wrote ${active.length} profiles`);

  // Silence linter for _ = addSubSectionLabel (reserved for future use)
  void addSubSectionLabel;

  await wb.xlsx.writeFile(OUT_FILE);
  console.log(`\n📁 Saved: ${OUT_FILE}`);
  const stat = fs.statSync(OUT_FILE);
  console.log(`   Size: ${(stat.size / 1024).toFixed(1)} KB\n`);

  await ds.destroy();
}

main().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});

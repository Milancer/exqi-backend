import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { BusinessProcessNode, BpLevel } from './entities/business-process-node.entity';

/**
 * Importer for the SITA "Business Process Hierarchy" workbook (V48 and onwards).
 *
 * The workbook ships with three layers of data spread across many sheets:
 *   - "Inventory" — flat side-by-side Process+Sub-Process listing for all 3 Groups
 *   - per-Process sheets ("M1"…"M8", "C1"…"C10", "S1 Fin", "S2_HCM", …) —
 *     contain the Procedure rows plus an authoritative copy of the Sub-Process names
 *
 * The data is messy (typos, missing codes, header drift between sheets), so the
 * parser is deliberately tolerant: it scans every cell, recognises codes by the
 * `[MCS]\d+(\.\d+){0,2}` pattern, and pairs them with the nearest right-side
 * non-empty string cell as the name.
 *
 * Idempotent on `code`. Safe to re-run.
 */

const CODE_RE = /^([MCS])(\d+)(?:\.(\d+))?(?:\.(\d+))?\s*$/;
const CODE_PREFIX_RE = /^([MCS])(\d+)(?:\.(\d+))?(?:\.(\d+))?\s*[\.\-:]?\s*/;

const GROUP_NAME: Record<string, string> = {
  M: 'Enterprise',
  C: 'Core',
  S: 'Support',
};

const SKIP_SHEETS = new Set([
  'Template (Standard)',
  'Sub-Process Status',
  'Process mapping status',
  'Template (Channels',
  'Template (Channels)',
  // EM6 / E1 are alternate-schema drafts (not part of the canonical M/C/S hierarchy).
  'EM6',
  'E1',
]);

interface ParsedNode {
  code: string;
  name: string;
  definition: string | null;
  sort_order: number;
}

export interface ImportReport {
  groupsUpserted: number;
  processesUpserted: number;
  subProcessesUpserted: number;
  proceduresUpserted: number;
  skippedSheets: string[];
  totalNodesAfter: number;
}

function parseCode(s: string | null | undefined): { group: string; p: number; sp?: number; pr?: number } | null {
  if (!s || typeof s !== 'string') return null;
  const m = CODE_RE.exec(s.trim());
  if (!m) return null;
  return {
    group: m[1],
    p: Number(m[2]),
    sp: m[3] ? Number(m[3]) : undefined,
    pr: m[4] ? Number(m[4]) : undefined,
  };
}

function levelFor(parsed: { sp?: number; pr?: number }): BpLevel {
  if (parsed.pr !== undefined) return 'procedure';
  if (parsed.sp !== undefined) return 'sub_process';
  return 'process';
}

/** Strip a leading code from a name cell, e.g. "M1.1.1 Maintain ideal..." → "Maintain ideal..." */
function stripLeadingCode(s: string): string {
  return s.replace(CODE_PREFIX_RE, '').trim();
}

/** Normalize a name (collapse whitespace, drop trailing punctuation noise). */
function normaliseName(s: string): string {
  return s.replace(/\s+/g, ' ').replace(/[\s\.\-:]+$/, '').trim();
}

/** Header cells we never want to take as a "name" for a code. */
const HEADER_BLOCKLIST = /^(level\s*\d+|l[12345]#?|process|sub-?process|procedure|definition|owner|execution\s+status|in-?house|tasks?|sub-?process\s+status|previous\s+l[12345]|definition\s*\/?\s*comments?)\b/i;

function isHeaderish(s: string): boolean {
  return HEADER_BLOCKLIST.test(s.trim());
}

function readNameNearby(row: any[], startCol: number): string | null {
  // Look at the next 3 cells to the right for a non-empty string.
  for (let j = startCol + 1; j < Math.min(row.length, startCol + 4); j++) {
    const v = row[j];
    if (typeof v === 'string') {
      const cleaned = normaliseName(stripLeadingCode(v));
      if (cleaned.length >= 2 && !isHeaderish(cleaned)) return cleaned;
    }
  }
  // Sometimes the name is glued INTO the same cell as the code (e.g. "M1 Manage Strategy").
  const here = row[startCol];
  if (typeof here === 'string') {
    const stripped = normaliseName(stripLeadingCode(here));
    if (stripped.length >= 2 && !isHeaderish(stripped)) return stripped;
  }
  return null;
}

/** Hardcoded fallback Process names — used when the per-sheet header is missing/typo'd. */
const PROCESS_NAME_FALLBACK: Record<string, string> = {
  M1: 'Manage Strategy',
  M2: 'Manage Enterprise Digital Governance and Architecture',
  M3: 'Manage Reputation and Stakeholder Relations',
  M4: 'Manage Risk, Compliance and Integrity',
  M5: 'Manage Business Performance, Monitoring and Evaluation',
  M6: 'Manage Strategic Partnerships and Investor Relations',
  M7: 'Manage Innovation and IP',
  M8: 'Manage Business Process Optimisation and Quality',
  C1: 'Sense and Research Digital Demand',
  C2: 'Design, Develop & Engineer Products and Services',
  C3: 'Market Products and Services and Channels',
  C4: 'Manage Service Portfolio',
  C5: 'Sell and Contract Digital Solutions and Services',
  C6: 'Manage Digital Marketplace',
  C7: 'Operate Digital Platform Infrastructure (DPI)',
  C8: 'Deliver Managed Services',
  C9: 'Manage Revenue and Billing',
  C10: 'Manage Client Relationships and Account Growth',
  S1: 'Manage Finance',
  S2: 'Manage Human Capital',
  S3: 'Manage Supply Chain',
  S4: 'Manage IT (Internal)',
  S5: 'Manage Facilities, Logistics and Safety',
  S6: 'Manage Security',
  S7: 'Manage Knowledge and Information',
  S8: 'Manage Marketing (Internal)',
  S9: 'Manage Corporate Legal',
};

export async function importBusinessProcessesFromWorkbook(
  filePath: string,
  nodeRepo: Repository<BusinessProcessNode>,
): Promise<ImportReport> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const skipped: string[] = [];

  // ─── Stage 1: scan every non-skipped sheet, collect best-name-per-code ────
  // best name per code: longest non-headerish wins
  const bestName = new Map<string, string>();
  const definitionByCode = new Map<string, string>();

  const trySetName = (code: string, name: string | null) => {
    if (!name) return;
    const clean = normaliseName(name);
    if (clean.length < 2 || isHeaderish(clean)) return;
    const prev = bestName.get(code);
    if (!prev || clean.length > prev.length) {
      bestName.set(code, clean);
    }
  };

  for (const sheet of workbook.worksheets) {
    if (SKIP_SHEETS.has(sheet.name)) {
      skipped.push(sheet.name);
      continue;
    }
    sheet.eachRow({ includeEmpty: false }, (row) => {
      const values = row.values as any[]; // 1-indexed
      // Re-pack to 0-indexed for the helpers
      const packed: any[] = [];
      for (let i = 1; i < values.length; i++) packed.push(values[i]);

      for (let c = 0; c < packed.length; c++) {
        const v = packed[c];
        if (typeof v !== 'string') continue;
        const trimmed = v.trim();

        // Case A: cell is JUST a code (e.g. "M1.1.1")
        const exact = parseCode(trimmed);
        if (exact) {
          const codeStr = formatCode(exact);
          const name = readNameNearby(packed, c);
          trySetName(codeStr, name);
          continue;
        }

        // Case B: cell starts with a code and then the name (e.g. "M1 Manage Strategy")
        const prefix = CODE_PREFIX_RE.exec(trimmed);
        if (prefix) {
          const inner = parseCode(prefix[0].replace(/[\s\.\-:]+$/, ''));
          if (inner) {
            const codeStr = formatCode(inner);
            const name = normaliseName(stripLeadingCode(trimmed));
            if (name && !isHeaderish(name)) trySetName(codeStr, name);
          }
        }
      }
    });
  }

  // ─── Stage 2: walk the codes and add any missing intermediates ─────────
  // Make sure every Sub-Process has its parent Process, every Procedure has
  // its parent Sub-Process and Process, etc. Use fallback names for missing
  // Process rows.
  const allCodes = new Set(bestName.keys());
  for (const code of Array.from(allCodes)) {
    const parsed = parseCode(code);
    if (!parsed) continue;
    if (parsed.pr !== undefined) {
      const sp = `${parsed.group}${parsed.p}.${parsed.sp}`;
      const p = `${parsed.group}${parsed.p}`;
      if (!bestName.has(sp)) bestName.set(sp, `Sub-Process ${sp}`);
      if (!bestName.has(p)) bestName.set(p, PROCESS_NAME_FALLBACK[p] ?? `Process ${p}`);
    } else if (parsed.sp !== undefined) {
      const p = `${parsed.group}${parsed.p}`;
      if (!bestName.has(p)) bestName.set(p, PROCESS_NAME_FALLBACK[p] ?? `Process ${p}`);
    }
  }

  // ─── Stage 3: ensure all expected Process-level codes exist (8/10/9) ──
  for (let i = 1; i <= 8; i++) {
    const c = `M${i}`;
    if (!bestName.has(c)) bestName.set(c, PROCESS_NAME_FALLBACK[c] ?? `Process ${c}`);
  }
  for (let i = 1; i <= 10; i++) {
    const c = `C${i}`;
    if (!bestName.has(c)) bestName.set(c, PROCESS_NAME_FALLBACK[c] ?? `Process ${c}`);
  }
  for (let i = 1; i <= 9; i++) {
    const c = `S${i}`;
    if (!bestName.has(c)) bestName.set(c, PROCESS_NAME_FALLBACK[c] ?? `Process ${c}`);
  }

  // ─── Stage 4: build the upsert plan: 3 Groups + N Processes + Sub-Processes + Procedures ──
  const groupRows: ParsedNode[] = ['M', 'C', 'S'].map((g, idx) => ({
    code: GROUP_NAME[g],
    name: GROUP_NAME[g],
    definition: null,
    sort_order: idx,
  }));

  const processRows: ParsedNode[] = [];
  const subProcessRows: ParsedNode[] = [];
  const procedureRows: ParsedNode[] = [];

  for (const [code, name] of bestName.entries()) {
    const parsed = parseCode(code);
    if (!parsed) continue;
    const node: ParsedNode = {
      code,
      name,
      definition: definitionByCode.get(code) ?? null,
      sort_order:
        parsed.p * 1_000_000 + (parsed.sp ?? 0) * 1000 + (parsed.pr ?? 0),
    };
    if (parsed.pr !== undefined) procedureRows.push(node);
    else if (parsed.sp !== undefined) subProcessRows.push(node);
    else processRows.push(node);
  }

  // ─── Stage 5: persist (Groups → Processes → Sub-Processes → Procedures) ──
  const idByCode = new Map<string, number>();

  // Groups
  for (const g of groupRows) {
    const saved = await upsertNode(nodeRepo, {
      level: 'group',
      code: g.code,
      name: g.name,
      definition: null,
      sort_order: g.sort_order,
      parent_id: null,
    });
    idByCode.set(g.code, saved.id);
  }

  // Processes (parent = Group)
  for (const p of processRows) {
    const parsed = parseCode(p.code)!;
    const parent_id = idByCode.get(GROUP_NAME[parsed.group]) ?? null;
    const saved = await upsertNode(nodeRepo, {
      level: 'process',
      code: p.code,
      name: p.name,
      definition: p.definition,
      sort_order: p.sort_order,
      parent_id,
    });
    idByCode.set(p.code, saved.id);
  }

  // Sub-Processes (parent = Process)
  for (const sp of subProcessRows) {
    const parsed = parseCode(sp.code)!;
    const parentCode = `${parsed.group}${parsed.p}`;
    const parent_id = idByCode.get(parentCode) ?? null;
    const saved = await upsertNode(nodeRepo, {
      level: 'sub_process',
      code: sp.code,
      name: sp.name,
      definition: sp.definition,
      sort_order: sp.sort_order,
      parent_id,
    });
    idByCode.set(sp.code, saved.id);
  }

  // Procedures (parent = Sub-Process)
  for (const pr of procedureRows) {
    const parsed = parseCode(pr.code)!;
    const parentCode = `${parsed.group}${parsed.p}.${parsed.sp}`;
    const parent_id = idByCode.get(parentCode) ?? null;
    const saved = await upsertNode(nodeRepo, {
      level: 'procedure',
      code: pr.code,
      name: pr.name,
      definition: pr.definition,
      sort_order: pr.sort_order,
      parent_id,
    });
    idByCode.set(pr.code, saved.id);
  }

  const totalAfter = await nodeRepo.count();
  return {
    groupsUpserted: groupRows.length,
    processesUpserted: processRows.length,
    subProcessesUpserted: subProcessRows.length,
    proceduresUpserted: procedureRows.length,
    skippedSheets: skipped,
    totalNodesAfter: totalAfter,
  };
}

function formatCode(p: { group: string; p: number; sp?: number; pr?: number }): string {
  let s = `${p.group}${p.p}`;
  if (p.sp !== undefined) s += `.${p.sp}`;
  if (p.pr !== undefined) s += `.${p.pr}`;
  return s;
}

interface UpsertInput {
  level: BpLevel;
  code: string;
  name: string;
  definition: string | null;
  sort_order: number;
  parent_id: number | null;
}

async function upsertNode(
  repo: Repository<BusinessProcessNode>,
  data: UpsertInput,
): Promise<BusinessProcessNode> {
  const existing = await repo.findOne({ where: { code: data.code } });
  if (existing) {
    existing.level = data.level;
    existing.name = data.name;
    if (data.definition != null) existing.definition = data.definition;
    existing.sort_order = data.sort_order;
    existing.parent_id = data.parent_id;
    return repo.save(existing);
  }
  const created = repo.create(data);
  return repo.save(created);
}

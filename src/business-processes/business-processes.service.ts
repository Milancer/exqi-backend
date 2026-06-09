import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { BusinessProcessNode, BpLevel } from './entities/business-process-node.entity';
import { JobProfileBusinessProcess } from './entities/job-profile-business-process.entity';
import { UserRole } from '../users/entities/user.entity';
import { importBusinessProcessesFromWorkbook } from './bp-excel-importer';

export interface BpTreeNode {
  id: number;
  parent_id: number | null;
  level: BpLevel;
  code: string;
  name: string;
  definition: string | null;
  sort_order: number;
  children: BpTreeNode[];
}

@Injectable()
export class BusinessProcessesService {
  constructor(
    @InjectRepository(BusinessProcessNode)
    private readonly nodeRepository: Repository<BusinessProcessNode>,
    @InjectRepository(JobProfileBusinessProcess)
    private readonly joinRepository: Repository<JobProfileBusinessProcess>,
  ) {}

  /** All Group nodes (Enterprise / Core / Support). Always 3 rows after seeding. */
  async getGroups(): Promise<BusinessProcessNode[]> {
    return this.nodeRepository.find({
      where: { level: 'group', is_active: true, parent_id: IsNull() },
      order: { sort_order: 'ASC', code: 'ASC' },
    });
  }

  /**
   * Return the full tree under one Group (or all Groups if `groupCode` is null),
   * hydrated as nested children. Cheap: catalogue size is bounded (low thousands).
   */
  async getTree(groupCode?: string): Promise<BpTreeNode[]> {
    const all = await this.nodeRepository.find({
      where: { is_active: true },
      order: { sort_order: 'ASC', code: 'ASC' },
    });

    const byId = new Map<number, BpTreeNode>();
    for (const n of all) {
      byId.set(n.id, {
        id: n.id,
        parent_id: n.parent_id,
        level: n.level,
        code: n.code,
        name: n.name,
        definition: n.definition,
        sort_order: n.sort_order,
        children: [],
      });
    }
    const roots: BpTreeNode[] = [];
    for (const n of all) {
      const node = byId.get(n.id)!;
      if (n.parent_id == null) {
        roots.push(node);
      } else {
        const parent = byId.get(n.parent_id);
        if (parent) parent.children.push(node);
      }
    }

    if (groupCode) {
      const group = roots.find((r) => r.code === groupCode);
      return group ? [group] : [];
    }
    return roots;
  }

  /** Used by JobProfilesService to hydrate the selection on the JP detail view. */
  async getSelectionForJobProfile(jobProfileId: number): Promise<BusinessProcessNode[]> {
    const rows = await this.joinRepository.find({
      where: { job_profile_id: jobProfileId },
    });
    return rows.map((r) => r.node);
  }

  /**
   * Replace the BP selection on a Job Profile atomically, with per-node
   * RACI flags. Each selection carries four booleans (R/A/C/I) — all default
   * to false, multiple can be true on the same row.
   *
   * Persists only leaf-most picks: if a user selects M1.1.3 (a Procedure) we
   * store that one row, and the chain back to "Enterprise" is derived at read
   * time. This means the join row count stays small even on JPs with many
   * procedures across multiple processes.
   */
  async setSelectionForJobProfile(
    jobProfileId: number,
    selections: Array<{
      node_id: number;
      is_responsible?: boolean;
      is_accountable?: boolean;
      is_consulted?: boolean;
      is_informed?: boolean;
    }>,
  ): Promise<BusinessProcessNode[]> {
    // Dedupe by node_id, keeping the last seen RACI flags.
    const byId = new Map<number, (typeof selections)[number]>();
    for (const s of selections) {
      if (Number.isInteger(s.node_id)) byId.set(s.node_id, s);
    }
    const unique = Array.from(byId.values());
    const uniqueIds = unique.map((s) => s.node_id);

    if (uniqueIds.length > 0) {
      const existing = await this.nodeRepository.find({
        where: { id: In(uniqueIds) },
      });
      if (existing.length !== uniqueIds.length) {
        const found = new Set(existing.map((n) => n.id));
        const missing = uniqueIds.filter((id) => !found.has(id));
        throw new NotFoundException(
          `Unknown business_process_node id(s): ${missing.join(', ')}`,
        );
      }
      // Reject Group-level picks — Groups are never persisted on a JP.
      const groupPicks = existing.filter((n) => n.level === 'group');
      if (groupPicks.length > 0) {
        throw new ForbiddenException(
          `Group-level nodes cannot be selected on a Job Profile (got: ${groupPicks
            .map((n) => n.code)
            .join(', ')}). Pick at the Process / Sub-Process / Procedure level instead.`,
        );
      }
    }

    await this.joinRepository.delete({ job_profile_id: jobProfileId });

    if (unique.length > 0) {
      const rows = unique.map((s) =>
        this.joinRepository.create({
          job_profile_id: jobProfileId,
          business_process_node_id: s.node_id,
          is_responsible: !!s.is_responsible,
          is_accountable: !!s.is_accountable,
          is_consulted: !!s.is_consulted,
          is_informed: !!s.is_informed,
        }),
      );
      await this.joinRepository.save(rows);
    }

    return this.getSelectionForJobProfile(jobProfileId);
  }

  /**
   * Admin-only seed/refresh from a SITA Business Process Hierarchy workbook.
   * Idempotent on `code` — re-running with V49/V50 updates names in place
   * and never breaks JP join rows.
   */
  async importFromWorkbookFile(filePath: string, user: any) {
    if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can import the Business Process catalogue');
    }
    return this.importFromWorkbookFilePublic(filePath);
  }

  /** No-auth variant for the CLI seed script. */
  async importFromWorkbookFilePublic(filePath: string) {
    return importBusinessProcessesFromWorkbook(filePath, this.nodeRepository);
  }
}

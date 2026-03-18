import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const CLIENT_CONFIG: Record<
  string,
  { sourceClientId: number; clientName: string }
> = {
  sita: { sourceClientId: 2, clientName: 'SITA' },
};

const DATA_DIR = path.join(__dirname, '..', 'exqi-export');
const BATCH_SIZE = 500;

function loadJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function mapStatus(status: string): string {
  return (
    {
      'In Progress': 'In Progress',
      'Awaiting Approval': 'Awaiting Approval',
      Approved: 'Approved',
      Active: 'Approved',
      Draft: 'In Progress',
    }[status] || 'In Progress'
  );
}

async function batchInsert(
  ds: DataSource,
  table: string,
  cols: string[],
  records: any[],
): Promise<void> {
  if (records.length === 0) return;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const values: any[] = [];
    const placeholders: string[] = [];
    batch.forEach((rec, idx) => {
      const rowPh: string[] = [];
      cols.forEach((col, colIdx) => {
        values.push(rec[col] ?? null);
        rowPh.push(`$${idx * cols.length + colIdx + 1}`);
      });
      placeholders.push(`(${rowPh.join(', ')})`);
    });
    await ds.query(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES ${placeholders.join(', ')}`,
      values,
    );
    process.stdout.write(
      `\r   Inserted ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`,
    );
  }
  console.log();
}

async function importClient(clientName: string) {
  const config = CLIENT_CONFIG[clientName.toLowerCase()];
  if (!config) {
    console.error(
      `Unknown client: ${clientName}. Available: ${Object.keys(CLIENT_CONFIG).join(', ')}`,
    );
    process.exit(1);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  FAST IMPORT: ${clientName.toUpperCase()}`);
  console.log(`${'='.repeat(60)}\n`);

  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  try {
    // Get client
    const clients = await ds.query(
      `SELECT id, name FROM client WHERE name = $1`,
      [config.clientName],
    );
    if (clients.length === 0) {
      console.error(
        `Client '${config.clientName}' not found. Run 'npm run seed' first.`,
      );
      process.exit(1);
    }
    const clientId = clients[0].id;
    console.log(`Client: ${clients[0].name} (id: ${clientId})\n`);

    // Load JSON
    console.log('Loading JSON files...');
    const departments = loadJson<any[]>('departments.json').filter(
      (d) => d.status === 'Active',
    );
    const jobGrades = loadJson<any[]>('job_grades.json').filter(
      (g) => g.status === 'Active',
    );
    const workLevels = loadJson<any[]>('work_levels.json').filter(
      (w) => w.status === 'Active',
    );
    const skills = loadJson<any[]>('skills.json').filter(
      (s) => s.status === 'Active',
    );
    const competencyTypes = loadJson<any[]>('competency_types.json').filter(
      (t) => t.status === 'Active',
    );
    const competencyClusters = loadJson<any[]>(
      'competency_clusters.json',
    ).filter((c) => c.status === 'Active');
    const competencies = loadJson<any[]>('competencies.json').filter(
      (c) => c.status === 'Active',
    );
    const jobProfiles = loadJson<any[]>('job_profiles.json').filter(
      (jp) => jp.client_id === config.sourceClientId,
    );
    const jpDeliverables = loadJson<any[]>('job_profile_deliverables.json');
    const jpCompetencies = loadJson<any[]>('job_profile_competencies.json');
    const jpSkills = loadJson<any[]>('job_profile_skills.json');
    const jpRequirements = loadJson<any[]>('job_profile_requirements.json');

    const jpIds = new Set(jobProfiles.map((jp) => jp.job_profile_id));
    console.log(`Found ${jobProfiles.length} job profiles\n`);

    // Maps
    const deptMap = new Map<number, number>();
    const gradeMap = new Map<number, number>();
    const skillMap = new Map<number, number>();
    const typeMap = new Map<number, number>();
    const clusterMap = new Map<number, number>();
    const compMap = new Map<number, number>();
    const jpMap = new Map<number, number>();

    // 1. Departments
    console.log('1. Departments...');
    const existDepts = await ds.query(
      `SELECT department_id, department FROM departments WHERE client_id = $1`,
      [clientId],
    );
    const existDeptNames = new Set(existDepts.map((d: any) => d.department));
    const newDepts = departments.filter(
      (d) => !existDeptNames.has(d.department),
    );
    if (newDepts.length > 0) {
      await batchInsert(
        ds,
        'departments',
        ['department', 'status', 'client_id'],
        newDepts.map((d) => ({
          department: d.department,
          status: 'Active',
          client_id: clientId,
        })),
      );
    }
    const allDepts = await ds.query(
      `SELECT department_id, department FROM departments WHERE client_id = $1`,
      [clientId],
    );
    allDepts.forEach((d: any) => {
      const src = departments.find((x) => x.department === d.department);
      if (src) deptMap.set(src.department_id, d.department_id);
    });
    console.log(`   ${deptMap.size} departments\n`);

    // 2. Job Grades
    console.log('2. Job Grades...');
    const existGrades = await ds.query(
      `SELECT job_grade_id, job_grade FROM job_grades WHERE client_id = $1`,
      [clientId],
    );
    const existGradeNames = new Set(existGrades.map((g: any) => g.job_grade));
    const newGrades = jobGrades.filter(
      (g) => !existGradeNames.has(g.job_grade),
    );
    if (newGrades.length > 0) {
      await batchInsert(
        ds,
        'job_grades',
        ['job_grade', 'status', 'client_id'],
        newGrades.map((g) => ({
          job_grade: g.job_grade,
          status: 'Active',
          client_id: clientId,
        })),
      );
    }
    const allGrades = await ds.query(
      `SELECT job_grade_id, job_grade FROM job_grades WHERE client_id = $1`,
      [clientId],
    );
    allGrades.forEach((g: any) => {
      const src = jobGrades.find((x) => x.job_grade === g.job_grade);
      if (src) gradeMap.set(src.job_grade_id, g.job_grade_id);
    });
    console.log(`   ${gradeMap.size} job grades\n`);

    // 3. Work Levels
    console.log('3. Work Levels...');
    const existWLs = await ds.query(
      `SELECT work_level_id, level_of_work FROM work_levels WHERE client_id = $1`,
      [clientId],
    );
    const existWLNames = new Set(existWLs.map((w: any) => w.level_of_work));
    const newWLs = workLevels.filter((w) => !existWLNames.has(w.level_of_work));
    if (newWLs.length > 0) {
      await batchInsert(
        ds,
        'work_levels',
        ['level_of_work', 'scope', 'focus', 'judgement', 'status', 'client_id'],
        newWLs.map((w) => ({
          level_of_work: (w.level_of_work || '').substring(0, 255),
          scope: (w.scope || '').substring(0, 45),
          focus: (w.focus || '').substring(0, 255),
          judgement: (w.judgement || '').substring(0, 255),
          status: 'Active',
          client_id: clientId,
        })),
      );
    }
    console.log(`   ${workLevels.length} work levels\n`);

    // 4. Skills
    console.log('4. Skills...');
    const existSkills = await ds.query(
      `SELECT skill_id, skill FROM skills WHERE client_id = $1`,
      [clientId],
    );
    const existSkillNames = new Set(existSkills.map((s: any) => s.skill));
    const newSkills = skills.filter((s) => !existSkillNames.has(s.skill));
    if (newSkills.length > 0) {
      await batchInsert(
        ds,
        'skills',
        ['skill', 'description', 'indicators', 'status', 'client_id'],
        newSkills.map((s) => ({
          skill: s.skill,
          description: s.description || '',
          indicators: Array.isArray(s.indicators)
            ? JSON.stringify(s.indicators)
            : s.indicators || null,
          status: 'Active',
          client_id: clientId,
        })),
      );
    }
    const allSkills = await ds.query(
      `SELECT skill_id, skill FROM skills WHERE client_id = $1`,
      [clientId],
    );
    allSkills.forEach((s: any) => {
      const src = skills.find((x) => x.skill === s.skill);
      if (src) skillMap.set(src.skill_id, s.skill_id);
    });
    console.log(`   ${skillMap.size} skills\n`);

    // 5. Competency Types
    console.log('5. Competency Types...');
    const existTypes = await ds.query(
      `SELECT jp_competency_type_id, competency_type FROM jp_competency_types WHERE client_id = $1`,
      [clientId],
    );
    const existTypeNames = new Set(
      existTypes.map((t: any) => t.competency_type),
    );
    const newTypes = competencyTypes.filter(
      (t) => !existTypeNames.has(t.competency_type),
    );
    if (newTypes.length > 0) {
      await batchInsert(
        ds,
        'jp_competency_types',
        ['competency_type', 'status', 'client_id'],
        newTypes.map((t) => ({
          competency_type: t.competency_type,
          status: 'Active',
          client_id: clientId,
        })),
      );
    }
    const allTypes = await ds.query(
      `SELECT jp_competency_type_id, competency_type FROM jp_competency_types WHERE client_id = $1`,
      [clientId],
    );
    allTypes.forEach((t: any) => {
      const src = competencyTypes.find(
        (x) => x.competency_type === t.competency_type,
      );
      if (src) typeMap.set(src.competency_type_id, t.jp_competency_type_id);
    });
    console.log(`   ${typeMap.size} types\n`);

    // 6. Competency Clusters + create "General" cluster for each type
    console.log('6. Competency Clusters...');
    const existClusters = await ds.query(
      `SELECT jp_competency_cluster_id, cluster_name, jp_competency_type_id FROM jp_competency_clusters WHERE client_id = $1`,
      [clientId],
    );
    const existClusterNames = new Set(
      existClusters.map((c: any) => c.cluster_name),
    );

    // Create "General" cluster for each type if it doesn't exist
    const generalClusters: any[] = [];
    for (const [, newTypeId] of typeMap.entries()) {
      const generalName = 'General';
      if (
        !existClusterNames.has(generalName) ||
        !existClusters.find(
          (c: any) =>
            c.cluster_name === generalName &&
            c.jp_competency_type_id === newTypeId,
        )
      ) {
        generalClusters.push({
          jp_competency_type_id: newTypeId,
          cluster_name: generalName,
          description: 'General competencies',
          status: 'Active',
          client_id: clientId,
        });
      }
    }
    if (generalClusters.length > 0) {
      await batchInsert(
        ds,
        'jp_competency_clusters',
        [
          'jp_competency_type_id',
          'cluster_name',
          'description',
          'status',
          'client_id',
        ],
        generalClusters,
      );
    }

    // Import other clusters
    const newClusters = competencyClusters.filter(
      (c) =>
        !existClusterNames.has(c.cluster_name) &&
        typeMap.has(c.competency_type_id),
    );
    if (newClusters.length > 0) {
      await batchInsert(
        ds,
        'jp_competency_clusters',
        [
          'jp_competency_type_id',
          'cluster_name',
          'description',
          'status',
          'client_id',
        ],
        newClusters.map((c) => ({
          jp_competency_type_id: typeMap.get(c.competency_type_id),
          cluster_name: c.cluster_name,
          description: c.description || '',
          status: 'Active',
          client_id: clientId,
        })),
      );
    }

    // Build cluster map + general cluster map by type
    const allClusters = await ds.query(
      `SELECT jp_competency_cluster_id, cluster_name, jp_competency_type_id FROM jp_competency_clusters WHERE client_id = $1`,
      [clientId],
    );
    const generalClusterByType = new Map<number, number>();
    allClusters.forEach((c: any) => {
      if (c.cluster_name === 'General') {
        generalClusterByType.set(
          c.jp_competency_type_id,
          c.jp_competency_cluster_id,
        );
      }
      const src = competencyClusters.find(
        (x) => x.cluster_name === c.cluster_name,
      );
      if (src)
        clusterMap.set(src.competency_cluster_id, c.jp_competency_cluster_id);
    });
    console.log(`   ${allClusters.length} clusters (including General)\n`);

    // 7. Competencies (use General cluster if no cluster mapped)
    console.log('7. Competencies...');
    const existComps = await ds.query(
      `SELECT jp_competency_id, competency FROM jp_competencies WHERE client_id = $1`,
      [clientId],
    );
    const existCompNames = new Set(existComps.map((c: any) => c.competency));
    const newComps = competencies.filter(
      (c) =>
        !existCompNames.has(c.competency) && typeMap.has(c.competency_type_id),
    );
    if (newComps.length > 0) {
      await batchInsert(
        ds,
        'jp_competencies',
        [
          'jp_competency_type_id',
          'jp_competency_cluster_id',
          'competency',
          'description',
          'indicators',
          'status',
          'client_id',
        ],
        newComps.map((c) => {
          const newTypeId = typeMap.get(c.competency_type_id)!;
          // Use mapped cluster, or fall back to General cluster for this type
          const clusterId =
            clusterMap.get(c.competency_cluster_id) ||
            generalClusterByType.get(newTypeId);
          return {
            jp_competency_type_id: newTypeId,
            jp_competency_cluster_id: clusterId,
            competency: c.competency,
            description: c.description || '',
            indicators: Array.isArray(c.indicators)
              ? c.indicators.join('\n')
              : c.indicators || '',
            status: 'Active',
            client_id: clientId,
          };
        }),
      );
    }
    const allComps = await ds.query(
      `SELECT jp_competency_id, competency FROM jp_competencies WHERE client_id = $1`,
      [clientId],
    );
    allComps.forEach((c: any) => {
      const src = competencies.find((x) => x.competency === c.competency);
      if (src) compMap.set(src.competency_id, c.jp_competency_id);
    });
    console.log(`   ${compMap.size} competencies\n`);

    // 8. Job Profiles
    console.log('8. Job Profiles...');
    const existJPs = await ds.query(
      `SELECT job_profile_id, job_title FROM job_profiles WHERE client_id = $1`,
      [clientId],
    );
    const existJPTitles = new Set(existJPs.map((jp: any) => jp.job_title));
    const newJPs = jobProfiles.filter((jp) => !existJPTitles.has(jp.job_title));
    if (newJPs.length > 0) {
      await batchInsert(
        ds,
        'job_profiles',
        [
          'client_id',
          'user_id',
          'job_title',
          'job_purpose',
          'department_id',
          'division',
          'job_family',
          'job_location',
          'level_of_work',
          'job_grade_id',
          'status',
        ],
        newJPs.map((jp) => ({
          client_id: clientId,
          user_id: '1',
          job_title: jp.job_title,
          job_purpose: jp.job_purpose || '',
          department_id: deptMap.get(jp.department_id) || null,
          division: jp.division || null,
          job_family: jp.job_family || null,
          job_location: jp.job_location || null,
          level_of_work: jp.level_of_work || null,
          job_grade_id: gradeMap.get(jp.job_grade_id) || null,
          status: mapStatus(jp.status),
        })),
      );
    }
    const allJPs = await ds.query(
      `SELECT job_profile_id, job_title FROM job_profiles WHERE client_id = $1`,
      [clientId],
    );
    allJPs.forEach((jp: any) => {
      const src = jobProfiles.find((x) => x.job_title === jp.job_title);
      if (src) jpMap.set(src.job_profile_id, jp.job_profile_id);
    });
    console.log(`   ${jpMap.size} job profiles\n`);

    // 9. Deliverables (check existing to avoid duplicates)
    console.log('9. Deliverables...');
    const existDeliverables = await ds.query(
      `SELECT job_profile_id, deliverable FROM job_profile_deliverables`,
    );
    const existDelKeys = new Set(
      existDeliverables.map(
        (d: any) => `${d.job_profile_id}-${d.deliverable?.substring(0, 100)}`,
      ),
    );
    const delRecs = jpDeliverables
      .filter((d) => jpIds.has(d.job_profile_id) && jpMap.has(d.job_profile_id))
      .map((d) => ({
        job_profile_id: jpMap.get(d.job_profile_id),
        deliverable: (
          [d.kpa, d.kpis, d.responsibilities].filter(Boolean).join(' | ') ||
          d.deliverable ||
          ''
        ).substring(0, 5000),
        sequence: d.weight || d.sequence || 1,
        status: 'Active',
      }))
      .filter(
        (d) =>
          !existDelKeys.has(
            `${d.job_profile_id}-${d.deliverable?.substring(0, 100)}`,
          ),
      );
    if (delRecs.length > 0)
      await batchInsert(
        ds,
        'job_profile_deliverables',
        ['job_profile_id', 'deliverable', 'sequence', 'status'],
        delRecs,
      );
    console.log(`   ${delRecs.length} deliverables (skipped existing)\n`);

    // 10. JP Competencies (check existing to avoid duplicates)
    console.log('10. JP Competencies...');
    const existJpComps = await ds.query(
      `SELECT job_profile_id, jp_competency_id FROM job_profile_competencies`,
    );
    const existJpCompKeys = new Set(
      existJpComps.map((c: any) => `${c.job_profile_id}-${c.jp_competency_id}`),
    );
    const jpcRecs = jpCompetencies
      .filter(
        (jpc) =>
          jpIds.has(jpc.job_profile_id) &&
          jpMap.has(jpc.job_profile_id) &&
          compMap.has(jpc.competency_id || jpc.jp_competency_id),
      )
      .map((jpc) => ({
        job_profile_id: jpMap.get(jpc.job_profile_id),
        jp_competency_id: compMap.get(
          jpc.competency_id || jpc.jp_competency_id,
        ),
        level: jpc.level || 1,
        is_critical: jpc.critical === 1 || jpc.is_critical || false,
        is_differentiating: jpc.core === 1 || jpc.is_differentiating || false,
      }))
      .filter(
        (jpc) =>
          !existJpCompKeys.has(`${jpc.job_profile_id}-${jpc.jp_competency_id}`),
      );
    if (jpcRecs.length > 0)
      await batchInsert(
        ds,
        'job_profile_competencies',
        [
          'job_profile_id',
          'jp_competency_id',
          'level',
          'is_critical',
          'is_differentiating',
        ],
        jpcRecs,
      );
    console.log(`   ${jpcRecs.length} jp competencies (skipped existing)\n`);

    // 11. JP Skills (check existing to avoid duplicates)
    console.log('11. JP Skills...');
    const existJpSkills = await ds.query(
      `SELECT job_profile_id, skill_id FROM job_profile_skills`,
    );
    const existJpSkillKeys = new Set(
      existJpSkills.map((s: any) => `${s.job_profile_id}-${s.skill_id}`),
    );
    const jpsRecs = jpSkills
      .filter(
        (jps) => jpIds.has(jps.job_profile_id) && jpMap.has(jps.job_profile_id),
      )
      .map((jps) => ({
        job_profile_id: jpMap.get(jps.job_profile_id),
        skill_id: skillMap.get(jps.skill_id) || null,
        level: jps.level || 1,
        is_critical: jps.is_critical || false,
        status: 'Active',
      }))
      .filter(
        (jps) => !existJpSkillKeys.has(`${jps.job_profile_id}-${jps.skill_id}`),
      );
    if (jpsRecs.length > 0)
      await batchInsert(
        ds,
        'job_profile_skills',
        ['job_profile_id', 'skill_id', 'level', 'is_critical', 'status'],
        jpsRecs,
      );
    console.log(`   ${jpsRecs.length} jp skills (skipped existing)\n`);

    // 12. JP Requirements (one per job profile - check existing)
    console.log('12. JP Requirements...');
    const existReqs = await ds.query(
      `SELECT job_profile_id FROM job_profile_requirements`,
    );
    const existReqJpIds = new Set(existReqs.map((r: any) => r.job_profile_id));
    const jprRecs = jpRequirements
      .filter(
        (jpr) =>
          jpIds.has(jpr.job_profile_id) &&
          jpMap.has(jpr.job_profile_id) &&
          !existReqJpIds.has(jpMap.get(jpr.job_profile_id)),
      )
      .map((jpr) => ({
        job_profile_id: jpMap.get(jpr.job_profile_id),
        education:
          [jpr.minimum_qualification, jpr.preferred_qualification]
            .filter(Boolean)
            .join(' | ') ||
          jpr.education ||
          '',
        experience: jpr.work_experience || jpr.experience || '',
        certifications:
          [jpr.certification, jpr.professional_body_registration]
            .filter(Boolean)
            .join(' | ') ||
          jpr.certifications ||
          '',
        other_requirements: jpr.knowledge || jpr.other_requirements || '',
        status: 'Active',
      }));
    if (jprRecs.length > 0)
      await batchInsert(
        ds,
        'job_profile_requirements',
        [
          'job_profile_id',
          'education',
          'experience',
          'certifications',
          'other_requirements',
          'status',
        ],
        jprRecs,
      );
    console.log(`   ${jprRecs.length} jp requirements\n`);

    console.log(`${'='.repeat(60)}`);
    console.log(`  DONE: ${clientName.toUpperCase()}`);
    console.log(
      `  Job Profiles: ${jpMap.size}, Deliverables: ${delRecs.length}`,
    );
    console.log(
      `  Competencies: ${jpcRecs.length}, Skills: ${jpsRecs.length}, Requirements: ${jprRecs.length}`,
    );
    console.log(`${'='.repeat(60)}\n`);
  } finally {
    await app.close();
  }
}

const arg = process.argv[2];
if (!arg) {
  console.log('Usage: npm run import:client <name>');
  process.exit(1);
}
importClient(arg).catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});

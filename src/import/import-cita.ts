import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

// Entity imports
import { JpCompetencyType } from '../job-profiles/entities/jp-competency-type.entity';
import { JpCompetencyCluster } from '../job-profiles/entities/jp-competency-cluster.entity';
import { JpCompetency } from '../job-profiles/entities/jp-competency.entity';
import { JobProfile } from '../job-profiles/entities/job-profile.entity';
import { JobProfileDeliverable } from '../job-profiles/entities/job-profile-deliverable.entity';
import { JobProfileCompetency } from '../job-profiles/entities/job-profile-competency.entity';
import { JobProfileSkill } from '../job-profiles/entities/job-profile-skill.entity';
import { JobProfileRequirement } from '../job-profiles/entities/job-profile-requirement.entity';

const CLIENT_ID = 2; // CITA
const DATA_DIR = 'C:\\Data';

async function importCitaData() {
  console.log('=== CITA Data Import ===');
  console.log(`Importing data for client_id: ${CLIENT_ID}`);

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nexus',
    entities: [
      JpCompetencyType,
      JpCompetencyCluster,
      JpCompetency,
      JobProfile,
      JobProfileDeliverable,
      JobProfileCompetency,
      JobProfileSkill,
      JobProfileRequirement,
    ],
    synchronize: false,
    ssl: process.env.DB_HOST?.includes('railway') ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected.');

    // Load JSON files
    const jpCompetencyTypes = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'jp_competency_types.json'), 'utf-8')
    );
    const jpCompetencyClusters = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'jp_competency_clusters.json'), 'utf-8')
    );
    const jpCompetencies = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'jp_competencies.json'), 'utf-8')
    );
    const jobProfiles = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'job_profiles.json'), 'utf-8')
    );
    const jobProfileDeliverables = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'job_profile_deliverables.json'), 'utf-8')
    );
    const jobProfileCompetencies = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'job_profile_competencies.json'), 'utf-8')
    );
    const jobProfileSkills = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'job_profile_skills.json'), 'utf-8')
    );
    const jobProfileRequirements = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'job_profile_requirements.json'), 'utf-8')
    );

    // Track ID mappings (old ID -> new ID)
    const typeIdMap = new Map<number, number>();
    const clusterIdMap = new Map<number, number>();
    const competencyIdMap = new Map<number, number>();
    const jobProfileIdMap = new Map<number, number>();

    // 1. Import JP Competency Types
    console.log('\n1. Importing JP Competency Types...');
    const typeRepo = dataSource.getRepository(JpCompetencyType);
    for (const type of jpCompetencyTypes.filter((t: any) => t.status === 'Active')) {
      const newType = typeRepo.create({
        competency_type: type.competency_type,
        status: 'Active',
        client_id: CLIENT_ID,
      });
      const saved = await typeRepo.save(newType);
      typeIdMap.set(type.jp_competency_type_id, saved.jp_competency_type_id);
      console.log(`  Type: ${type.competency_type} (${type.jp_competency_type_id} -> ${saved.jp_competency_type_id})`);
    }

    // 2. Import JP Competency Clusters
    console.log('\n2. Importing JP Competency Clusters...');
    const clusterRepo = dataSource.getRepository(JpCompetencyCluster);
    for (const cluster of jpCompetencyClusters.filter((c: any) => c.status === 'Active')) {
      const newTypeId = typeIdMap.get(cluster.jp_competency_type_id);
      if (!newTypeId) {
        console.log(`  Skipping cluster ${cluster.cluster_name} - type not found`);
        continue;
      }
      const newCluster = clusterRepo.create({
        jp_competency_type_id: newTypeId,
        cluster_name: cluster.cluster_name,
        description: cluster.description,
        status: 'Active',
        client_id: CLIENT_ID,
      });
      const saved = await clusterRepo.save(newCluster);
      clusterIdMap.set(cluster.jp_competency_cluster_id, saved.jp_competency_cluster_id);
      console.log(`  Cluster: ${cluster.cluster_name} (${cluster.jp_competency_cluster_id} -> ${saved.jp_competency_cluster_id})`);
    }

    // 3. Import JP Competencies
    console.log('\n3. Importing JP Competencies...');
    const competencyRepo = dataSource.getRepository(JpCompetency);
    for (const comp of jpCompetencies.filter((c: any) => c.status === 'Active')) {
      const newTypeId = typeIdMap.get(comp.jp_competency_type_id);
      const newClusterId = clusterIdMap.get(comp.jp_competency_cluster_id);
      if (!newTypeId || !newClusterId) {
        console.log(`  Skipping competency ${comp.competency} - type or cluster not found`);
        continue;
      }
      const newComp = competencyRepo.create({
        jp_competency_type_id: newTypeId,
        jp_competency_cluster_id: newClusterId,
        competency: comp.competency,
        description: comp.description,
        indicators: comp.indicators,
        status: 'Active',
        client_id: CLIENT_ID,
      });
      const saved = await competencyRepo.save(newComp);
      competencyIdMap.set(comp.jp_competency_id, saved.jp_competency_id);
      console.log(`  Competency: ${comp.competency.substring(0, 40)}... (${comp.jp_competency_id} -> ${saved.jp_competency_id})`);
    }

    // 4. Import Job Profiles (only Active/Approved ones, filter client_id=1)
    console.log('\n4. Importing Job Profiles...');
    const jpRepo = dataSource.getRepository(JobProfile);
    const validStatuses = ['Active', 'Approved', 'Awaiting Review', 'Draft'];
    const filteredProfiles = jobProfiles.filter(
      (jp: any) => jp.client_id === 1 && validStatuses.includes(jp.status) && jp.status !== 'Deleted'
    );

    for (const jp of filteredProfiles) {
      const newJp = jpRepo.create({
        client_id: CLIENT_ID,
        user_id: '1', // Default user - CITA admin will be user 1 in client 2
        job_title: jp.job_title,
        job_purpose: jp.job_purpose,
        department_id: null, // Will need to set up departments for CITA
        division: jp.division,
        job_family: jp.job_family,
        job_location: jp.job_location,
        level_of_work: jp.level_of_work,
        job_grade_id: null, // Will need to set up job grades for CITA
        reports_to: null,
        status: 'Active', // Import as Active
        reviewer_id: null,
        reviewed_at: null,
      });
      const saved = await jpRepo.save(newJp);
      jobProfileIdMap.set(jp.job_profile_id, saved.job_profile_id);
      console.log(`  Job Profile: ${jp.job_title.substring(0, 50)}... (${jp.job_profile_id} -> ${saved.job_profile_id})`);
    }

    // 5. Import Job Profile Deliverables
    console.log('\n5. Importing Job Profile Deliverables...');
    const deliverableRepo = dataSource.getRepository(JobProfileDeliverable);
    let deliverableCount = 0;
    for (const del of jobProfileDeliverables) {
      const newJpId = jobProfileIdMap.get(del.job_profile_id);
      if (!newJpId) continue;

      const newDel = deliverableRepo.create({
        job_profile_id: newJpId,
        deliverable: del.deliverable,
        sequence: del.sequence,
        status: del.status || 'Active',
      });
      await deliverableRepo.save(newDel);
      deliverableCount++;
    }
    console.log(`  Imported ${deliverableCount} deliverables`);

    // 6. Import Job Profile Competencies
    console.log('\n6. Importing Job Profile Competencies...');
    const jpcRepo = dataSource.getRepository(JobProfileCompetency);
    let competencyLinkCount = 0;
    for (const jpc of jobProfileCompetencies) {
      const newJpId = jobProfileIdMap.get(jpc.job_profile_id);
      const newCompId = competencyIdMap.get(jpc.jp_competency_id);
      if (!newJpId || !newCompId) continue;

      const newJpc = jpcRepo.create({
        job_profile_id: newJpId,
        jp_competency_id: newCompId,
        level: jpc.level,
        is_critical: jpc.is_critical || false,
        is_differentiating: jpc.is_differentiating || false,
      });
      await jpcRepo.save(newJpc);
      competencyLinkCount++;
    }
    console.log(`  Imported ${competencyLinkCount} competency links`);

    // 7. Import Job Profile Skills (if any exist)
    console.log('\n7. Importing Job Profile Skills...');
    const skillRepo = dataSource.getRepository(JobProfileSkill);
    let skillCount = 0;
    for (const skill of jobProfileSkills) {
      const newJpId = jobProfileIdMap.get(skill.job_profile_id);
      if (!newJpId) continue;

      const newSkill = skillRepo.create({
        job_profile_id: newJpId,
        skill_id: null, // Skills would need separate mapping
        level: skill.level,
        is_critical: skill.is_critical || false,
        status: skill.status || 'Active',
      });
      await skillRepo.save(newSkill);
      skillCount++;
    }
    console.log(`  Imported ${skillCount} skills`);

    // 8. Import Job Profile Requirements
    console.log('\n8. Importing Job Profile Requirements...');
    const reqRepo = dataSource.getRepository(JobProfileRequirement);
    let reqCount = 0;
    for (const req of jobProfileRequirements) {
      const newJpId = jobProfileIdMap.get(req.job_profile_id);
      if (!newJpId) continue;

      const newReq = reqRepo.create({
        job_profile_id: newJpId,
        education: req.education,
        experience: req.experience,
        certifications: req.certifications,
        other_requirements: req.other_requirements,
        status: req.status || 'Active',
      });
      await reqRepo.save(newReq);
      reqCount++;
    }
    console.log(`  Imported ${reqCount} requirements`);

    console.log('\n=== Import Complete ===');
    console.log(`Summary for Client ${CLIENT_ID} (CITA):`);
    console.log(`  - Competency Types: ${typeIdMap.size}`);
    console.log(`  - Competency Clusters: ${clusterIdMap.size}`);
    console.log(`  - Competencies: ${competencyIdMap.size}`);
    console.log(`  - Job Profiles: ${jobProfileIdMap.size}`);
    console.log(`  - Deliverables: ${deliverableCount}`);
    console.log(`  - Competency Links: ${competencyLinkCount}`);
    console.log(`  - Skills: ${skillCount}`);
    console.log(`  - Requirements: ${reqCount}`);

  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\nDatabase connection closed.');
    }
  }
}

importCitaData();

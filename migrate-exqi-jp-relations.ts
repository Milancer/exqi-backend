import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { JobProfile } from './src/job-profiles/entities/job-profile.entity';
import { JobProfileDeliverable } from './src/job-profiles/entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './src/job-profiles/entities/job-profile-requirement.entity';
import { JobProfileSkill } from './src/job-profiles/entities/job-profile-skill.entity';

// Load environment variables
dotenv.config();

const exportDir = path.join(__dirname, 'exqi-export');

async function migrateJPRelations() {
  console.log('Connecting to database...');
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false, // Turn off logging for bulk inserts
  });

  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');

    // 1. Get valid Job Profile IDs to ensure we don't violate FK constraints
    console.log('Fetching valid job profiles...');
    const jobProfiles = await AppDataSource.getRepository(JobProfile).find({
      select: ['job_profile_id'], // We only need the IDs
    });

    // Create a Set for fast O(1) lookups
    const validJobProfileIds = new Set(
      jobProfiles.map((jp) => jp.job_profile_id),
    );
    console.log(
      `Found ${validJobProfileIds.size} valid job profiles in Nexus.`,
    );

    // --- Deliverables ---
    console.log('\n--- Migrating Deliverables ---');
    const deliverablesPath = path.join(
      exportDir,
      'job_profile_deliverables.json',
    );
    if (fs.existsSync(deliverablesPath)) {
      const exqiDeliverables: any[] = JSON.parse(
        fs.readFileSync(deliverablesPath, 'utf8'),
      );
      console.log(`Found ${exqiDeliverables.length} deliverables in export.`);

      const mappedDeliverables: Partial<JobProfileDeliverable>[] = [];
      let skippedDeliverables = 0;

      for (const req of exqiDeliverables) {
        if (!validJobProfileIds.has(req.job_profile_id)) {
          skippedDeliverables++;
          continue;
        }

        let deliverableText: string[] = [];
        if (req.kpa) deliverableText.push(`KPA: ${req.kpa}`);
        if (req.responsibilities)
          deliverableText.push(`Responsibilities: ${req.responsibilities}`);
        if (req.kpis) deliverableText.push(`KPIs: ${req.kpis}`);
        if (req.weight !== undefined && req.weight !== null)
          deliverableText.push(`Weight: ${req.weight}%`);

        mappedDeliverables.push({
          // Assuming no conflicting PK sequence problems since auto-increment will handle if we don't supply it.
          // Actually, we can just insert the raw ID if we want, or let nextval handle it.
          // Better to let Nextval handle it to avoid sequence out of sync issues unless we are wiping.
          job_profile_id: req.job_profile_id,
          deliverable: deliverableText.join('\n\n'),
          sequence: req.sequence || 1,
          status: req.status === 'Active' ? 'Active' : 'Inactive',
        });
      }

      console.log(
        `Mapped ${mappedDeliverables.length} valid deliverables (Skipped ${skippedDeliverables} due to missing JP). Inserting...`,
      );
      if (mappedDeliverables.length > 0) {
        const chunkSize = 1000;
        let insertedCount = 0;
        for (let i = 0; i < mappedDeliverables.length; i += chunkSize) {
          const chunk = mappedDeliverables.slice(i, i + chunkSize);
          await AppDataSource.createQueryBuilder()
            .insert()
            .into(JobProfileDeliverable)
            .values(chunk)
            .execute(); // Removed orIgnore since we don't have a natural unique constraint to ignore on
          insertedCount += chunk.length;
          process.stdout.write(
            `\rInserted ${insertedCount}/${mappedDeliverables.length} deliverables...`,
          );
        }
        console.log('\nDeliverables migration complete.');
      }
    } else {
      console.log(`Warning: ${deliverablesPath} not found.`);
    }

    // --- Requirements ---
    console.log('\n--- Migrating Requirements ---');
    const requirementsPath = path.join(
      exportDir,
      'job_profile_requirements.json',
    );
    if (fs.existsSync(requirementsPath)) {
      const exqiRequirements: any[] = JSON.parse(
        fs.readFileSync(requirementsPath, 'utf8'),
      );
      console.log(`Found ${exqiRequirements.length} requirements in export.`);

      const mappedRequirements: Partial<JobProfileRequirement>[] = [];
      let skippedRequirements = 0;

      for (const req of exqiRequirements) {
        if (!validJobProfileIds.has(req.job_profile_id)) {
          skippedRequirements++;
          continue;
        }

        let education: string[] = [];
        if (req.minimum_qualification)
          education.push(`Minimum: ${req.minimum_qualification}`);
        if (req.preferred_qualification)
          education.push(`Preferred: ${req.preferred_qualification}`);

        let certifications: string[] = [];
        if (req.certification)
          certifications.push(`Certification: ${req.certification}`);
        if (req.professional_body_registration)
          certifications.push(
            `Professional Body: ${req.professional_body_registration}`,
          );

        mappedRequirements.push({
          job_profile_id: req.job_profile_id,
          education:
            education.length > 0 ? education.join('\n') : (null as any),
          experience: req.work_experience || (null as any),
          certifications:
            certifications.length > 0
              ? certifications.join('\n')
              : (null as any),
          other_requirements: req.knowledge || (null as any),
          status: req.status === 'Active' ? 'Active' : 'Inactive',
        });
      }

      console.log(
        `Mapped ${mappedRequirements.length} valid requirements (Skipped ${skippedRequirements} due to missing JP). Inserting...`,
      );
      if (mappedRequirements.length > 0) {
        const chunkSize = 1000;
        let insertedCount = 0;
        for (let i = 0; i < mappedRequirements.length; i += chunkSize) {
          const chunk = mappedRequirements.slice(i, i + chunkSize);
          await AppDataSource.createQueryBuilder()
            .insert()
            .into(JobProfileRequirement)
            .values(chunk)
            .execute();
          insertedCount += chunk.length;
          process.stdout.write(
            `\rInserted ${insertedCount}/${mappedRequirements.length} requirements...`,
          );
        }
        console.log('\nRequirements migration complete.');
      }
    } else {
      console.log(`Warning: ${requirementsPath} not found.`);
    }

    // --- Skills ---
    console.log('\n--- Migrating Skills ---');
    const jpSkillsPath = path.join(exportDir, 'job_profile_skills.json');
    const skillsPath = path.join(exportDir, 'skills.json');

    if (fs.existsSync(jpSkillsPath) && fs.existsSync(skillsPath)) {
      const exqiJpSkills: any[] = JSON.parse(
        fs.readFileSync(jpSkillsPath, 'utf8'),
      );
      const exqiSkills: any[] = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
      console.log(
        `Found ${exqiJpSkills.length} job profile skills and ${exqiSkills.length} base skills in export.`,
      );

      // Build a lookup map for skills: skill_id -> skill_name
      const skillNameMap = new Map<number, string>();
      for (const skill of exqiSkills) {
        skillNameMap.set(skill.skill_id, skill.skill); // Use 'skill' as the text name based on schema observed
      }

      const mappedSkills: Partial<JobProfileSkill>[] = [];
      let skippedSkills = 0;
      let missingSkillRefs = 0;

      for (const jpSkill of exqiJpSkills) {
        if (!validJobProfileIds.has(jpSkill.job_profile_id)) {
          skippedSkills++;
          continue;
        }

        const skillName = skillNameMap.get(jpSkill.skill_id);
        if (!skillName) {
          missingSkillRefs++;
          continue; // Can't insert skill without a name
        }

        mappedSkills.push({
          job_profile_id: jpSkill.job_profile_id,
          skill_name: skillName,
          level: parseInt(jpSkill.level, 10) || 1, // Cast string to number, defaulting to 1
          is_critical: false, // Defaulting to false as it's not present in exqi subset logically
          status: jpSkill.status === 'Active' ? 'Active' : 'Inactive',
        });
      }

      console.log(
        `Mapped ${mappedSkills.length} valid skills (Skipped ${skippedSkills} due to missing JP, ${missingSkillRefs} due to missing skill ref). Inserting...`,
      );
      if (mappedSkills.length > 0) {
        const chunkSize = 1000;
        let insertedCount = 0;
        for (let i = 0; i < mappedSkills.length; i += chunkSize) {
          const chunk = mappedSkills.slice(i, i + chunkSize);
          await AppDataSource.createQueryBuilder()
            .insert()
            .into(JobProfileSkill)
            .values(chunk)
            .execute();
          insertedCount += chunk.length;
          process.stdout.write(
            `\rInserted ${insertedCount}/${mappedSkills.length} skills...`,
          );
        }
        console.log('\nSkills migration complete.');
      }
    } else {
      console.log(
        `Warning: Either ${jpSkillsPath} or ${skillsPath} not found.`,
      );
    }

    console.log('\n--- Phase 3 Migration Completed successfully ---');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

migrateJPRelations();

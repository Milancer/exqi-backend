import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { JobGrade } from '../job-grades/entities/job-grade.entity';
import { WorkLevel } from '../work-levels/entities/work-level.entity';
import { Skill } from '../skills/entities/skill.entity';
import { JobProfile } from '../job-profiles/entities/job-profile.entity';
import { JobProfileCompetency } from '../job-profiles/entities/job-profile-competency.entity';
import { JobProfileSkill } from '../job-profiles/entities/job-profile-skill.entity';
import { JobProfileDeliverable } from '../job-profiles/entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from '../job-profiles/entities/job-profile-requirement.entity';
import { Competency } from '../competencies/entities/competency.entity';
import { CompetencyType } from '../competencies/entities/competency-type.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(JobGrade)
    private readonly jobGradeRepo: Repository<JobGrade>,
    @InjectRepository(WorkLevel)
    private readonly workLevelRepo: Repository<WorkLevel>,
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
    @InjectRepository(JobProfile)
    private readonly jobProfileRepo: Repository<JobProfile>,
    @InjectRepository(JobProfileCompetency)
    private readonly jpCompetencyRepo: Repository<JobProfileCompetency>,
    @InjectRepository(JobProfileSkill)
    private readonly jpSkillRepo: Repository<JobProfileSkill>,
    @InjectRepository(JobProfileDeliverable)
    private readonly jpDeliverableRepo: Repository<JobProfileDeliverable>,
    @InjectRepository(JobProfileRequirement)
    private readonly jpRequirementRepo: Repository<JobProfileRequirement>,
    @InjectRepository(Competency)
    private readonly competencyRepo: Repository<Competency>,
    @InjectRepository(CompetencyType)
    private readonly competencyTypeRepo: Repository<CompetencyType>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async importAllData(targetClientId?: number, clearExisting = false) {
    this.logger.log('🚀 Starting EXQi data import...');
    this.logger.log(`Target client_id: ${targetClientId || 'ALL'}`);

    try {
      if (clearExisting) {
        await this.clearAllData(targetClientId);
      }

      // 1. Import global reference data
      this.logger.log('📦 Importing global reference data...');
      await this.importClients();
      await this.importDepartments();
      await this.importJobGrades();
      await this.importWorkLevels();
      await this.importCompetencyTypes();
      await this.importCompetencies();
      await this.importSkills();

      // 2. Import client-specific data
      if (targetClientId) {
        this.logger.log(
          `📦 Importing data for client_id: ${targetClientId}...`,
        );
        await this.importJobProfilesForClient(targetClientId);
        await this.importJobProfileRelatedData(targetClientId);
      } else {
        this.logger.log('📦 Importing data for ALL clients...');
        await this.importAllJobProfiles();
        await this.importAllJobProfileRelatedData();
      }

      this.logger.log('✅ Import completed successfully!');
    } catch (error) {
      this.logger.error('❌ Import failed:', error.message);
      throw error;
    }
  }

  private async clearAllData(targetClientId?: number) {
    this.logger.log('🗑️  Clearing existing data...');

    if (targetClientId) {
      // Clear only client-specific data
      await this.jpRequirementRepo.delete({});
      await this.jpDeliverableRepo.delete({});
      await this.jpSkillRepo.delete({});
      await this.jpCompetencyRepo.delete({});
      await this.jobProfileRepo.delete({ client_id: targetClientId });
      this.logger.log(
        `Cleared data for client_id: ${targetClientId}`,
      );
    } else {
      // Clear all data
      await this.jpRequirementRepo.delete({});
      await this.jpDeliverableRepo.delete({});
      await this.jpSkillRepo.delete({});
      await this.jpCompetencyRepo.delete({});
      await this.jobProfileRepo.delete({});
      await this.skillRepo.delete({});
      await this.competencyRepo.delete({});
      await this.competencyTypeRepo.delete({});
      await this.workLevelRepo.delete({});
      await this.jobGradeRepo.delete({});
      await this.departmentRepo.delete({});
      this.logger.log('Cleared all data');
    }
  }

  private async importClients() {
    const data = require('../../exqi-export/clients.json');
    const existing = await this.clientRepo.find();

    // Only import clients that don't exist
    for (const c of data) {
      const existingClient = existing.find(
        (ec) => ec.id === c.client_id,
      );
      if (!existingClient) {
        const client = this.clientRepo.create({
          id: c.client_id,
          name: c.client_name,
          industry: c.industry,
          division: c.division,
          contactName: c.contact_person_name,
          contactSurname: c.contact_person_surname,
          position: c.position,
          contactPhoneNumber: c.contact_person_phone_number,
          contactEmail: c.contact_person_email_address,
          hrContactName: c.hr_contact_name,
          hrContactSurname: c.hr_contact_surname,
          hrContactPhoneNumber: c.hr_contact_phone_number,
          hrContactEmail: c.hr_contact_email_address,
          modules: [],
        });
        await this.clientRepo.save(client);
      }
    }
    this.logger.log(`✅ Imported ${data.length} clients`);
  }

  private async importDepartments() {
    const data = require('../../exqi-export/departments.json');
    await this.departmentRepo.delete({});

    const departments = data.map((d) =>
      this.departmentRepo.create({
        department_id: d.department_id,
        department: d.department,
        status: d.status || 'Active',
        client_id: 1, // Global reference data
      }),
    );

    await this.departmentRepo.save(departments);
    this.logger.log(`✅ Imported ${departments.length} departments`);
  }

  private async importJobGrades() {
    const data = require('../../exqi-export/job_grades.json');
    await this.jobGradeRepo.delete({});

    const grades = data.map((g) =>
      this.jobGradeRepo.create({
        job_grade_id: g.job_grade_id,
        job_grade: g.job_grade,
        status: g.status,
        client_id: 1,
      }),
    );

    await this.jobGradeRepo.save(grades);
    this.logger.log(`✅ Imported ${grades.length} job grades`);
  }

  private async importWorkLevels() {
    const data = require('../../exqi-export/work_levels.json');
    await this.workLevelRepo.delete({});

    const levels = data.map((wl) =>
      this.workLevelRepo.create({
        work_level_id: wl.work_level_id,
        level_of_work: wl.level_of_work,
        scope: wl.scope,
        focus: wl.focus,
        judgement: wl.judgement,
        status: wl.status || 'Active',
        client_id: 1,
      }),
    );

    await this.workLevelRepo.save(levels);
    this.logger.log(`✅ Imported ${levels.length} work levels`);
  }

  private async importCompetencyTypes() {
    const data = require('../../exqi-export/competency_types.json');
    await this.competencyTypeRepo.delete({});

    const types = data.map((ct) =>
      this.competencyTypeRepo.create({
        competency_type_id: ct.competency_type_id,
        competency_type: ct.competency_type,
        status: ct.status || 'Active',
        client_id: 1,
      }),
    );

    await this.competencyTypeRepo.save(types);
    this.logger.log(`✅ Imported ${types.length} competency types`);
  }

  private async importCompetencies() {
    const data = require('../../exqi-export/competencies.json');
    await this.competencyRepo.delete({});

    const competencies = data.map((c) =>
      this.competencyRepo.create({
        competency_id: c.competency_id,
        competency_type_id: c.competency_type_id,
        competency: c.competency,
        description: c.description,
        indicators: c.indicators,
        status: c.status || 'Active',
        client_id: 1,
      }),
    );

    await this.competencyRepo.save(competencies);
    this.logger.log(`✅ Imported ${competencies.length} competencies`);
  }

  private async importSkills() {
    const data = require('../../exqi-export/skills.json');
    await this.skillRepo.delete({});

    const skills = data.map((s) =>
      this.skillRepo.create({
        skill_id: s.skill_id,
        skill: s.skill,
        description: s.description,
        indicators: s.indicators,
        status: s.status || 'Active',
        client_id: 1,
      }),
    );

    await this.skillRepo.save(skills);
    this.logger.log(`✅ Imported ${skills.length} skills`);
  }

  private async importJobProfilesForClient(clientId: number) {
    const data = require('../../exqi-export/job_profiles.json');

    // Filter by client_id
    const clientData = data.filter((jp) => jp.client_id === clientId);

    if (clientData.length === 0) {
      this.logger.warn(`No job profiles found for client_id: ${clientId}`);
      return;
    }

    // Delete existing for this client
    await this.jobProfileRepo.delete({ client_id: clientId });

    const profiles = clientData.map((jp) =>
      this.jobProfileRepo.create({
        job_profile_id: jp.job_profile_id,
        client_id: jp.client_id,
        user_id: jp.user_id,
        job_title: jp.job_title,
        job_purpose: jp.job_purpose,
        department_id: jp.department_id,
        division: jp.division,
        job_family: jp.job_family,
        job_location: jp.job_location,
        level_of_work: jp.level_of_work,
        job_grade_id: jp.job_grade_id,
        reports_to: jp.reports_to,
        status: jp.status || 'In Progress',
        created: jp.created ? new Date(jp.created) : undefined,
        updated: jp.updated ? new Date(jp.updated) : undefined,
      }),
    );

    await this.jobProfileRepo.save(profiles);
    this.logger.log(
      `✅ Imported ${profiles.length} job profiles for client ${clientId}`,
    );
  }

  private async importAllJobProfiles() {
    const data = require('../../exqi-export/job_profiles.json');
    await this.jobProfileRepo.delete({});

    const profiles = data.map((jp) =>
      this.jobProfileRepo.create({
        job_profile_id: jp.job_profile_id,
        client_id: jp.client_id,
        user_id: jp.user_id,
        job_title: jp.job_title,
        job_purpose: jp.job_purpose,
        department_id: jp.department_id,
        division: jp.division,
        job_family: jp.job_family,
        job_location: jp.job_location,
        level_of_work: jp.level_of_work,
        job_grade_id: jp.job_grade_id,
        reports_to: jp.reports_to,
        status: jp.status || 'In Progress',
        created: jp.created ? new Date(jp.created) : undefined,
        updated: jp.updated ? new Date(jp.updated) : undefined,
      }),
    );

    await this.jobProfileRepo.save(profiles);
    this.logger.log(`✅ Imported ${profiles.length} job profiles (all clients)`);
  }

  private async importJobProfileRelatedData(clientId: number) {
    // Get all job_profile_ids for this client
    const clientProfiles = await this.jobProfileRepo.find({
      where: { client_id: clientId },
      select: ['job_profile_id'],
    });

    if (clientProfiles.length === 0) {
      this.logger.warn(
        `No job profiles found for client ${clientId}, skipping related data`,
      );
      return;
    }

    const profileIds = clientProfiles.map((p) => p.job_profile_id);

    await this.importJobProfileCompetencies(profileIds);
    await this.importJobProfileSkills(profileIds);
    await this.importJobProfileDeliverables(profileIds);
    await this.importJobProfileRequirements(profileIds);
  }

  private async importAllJobProfileRelatedData() {
    const allProfiles = await this.jobProfileRepo.find({
      select: ['job_profile_id'],
    });
    const profileIds = allProfiles.map((p) => p.job_profile_id);

    await this.importJobProfileCompetencies(profileIds);
    await this.importJobProfileSkills(profileIds);
    await this.importJobProfileDeliverables(profileIds);
    await this.importJobProfileRequirements(profileIds);
  }

  private async importJobProfileCompetencies(profileIds: number[]) {
    const data = require('../../exqi-export/job_profile_competencies.json');
    const filtered = data.filter((jpc) =>
      profileIds.includes(jpc.job_profile_id),
    );

    if (filtered.length === 0) return;

    await this.jpCompetencyRepo.delete({});

    const competencies = filtered.map((jpc) =>
      this.jpCompetencyRepo.create({
        job_profile_id: jpc.job_profile_id,
        competency_id: jpc.competency_id,
        level: jpc.level,
        is_critical: jpc.critical === 1,
        is_differentiating: jpc.core === 1,
      }),
    );

    // Save in batches to avoid memory issues
    const batchSize = 500;
    for (let i = 0; i < competencies.length; i += batchSize) {
      const batch = competencies.slice(i, i + batchSize);
      await this.jpCompetencyRepo.save(batch);
    }

    this.logger.log(
      `✅ Imported ${competencies.length} job profile competencies`,
    );
  }

  private async importJobProfileSkills(profileIds: number[]) {
    const data = require('../../exqi-export/job_profile_skills.json');
    const filtered = data.filter((jps) =>
      profileIds.includes(jps.job_profile_id),
    );

    if (filtered.length === 0) return;

    await this.jpSkillRepo.delete({});

    const skills = filtered.map((jps) =>
      this.jpSkillRepo.create({
        job_profile_skill_id: jps.job_profile_skill_id,
        job_profile_id: jps.job_profile_id,
        skill_id: jps.skill_id,
        level: jps.level,
        status: jps.status || 'Active',
      }),
    );

    await this.jpSkillRepo.save(skills);
    this.logger.log(`✅ Imported ${skills.length} job profile skills`);
  }

  private async importJobProfileDeliverables(profileIds: number[]) {
    const data = require('../../exqi-export/job_profile_deliverables.json');
    const filtered = data.filter((jpd) =>
      profileIds.includes(jpd.job_profile_id),
    );

    if (filtered.length === 0) return;

    await this.jpDeliverableRepo.delete({});

    const deliverables = filtered.map((jpd) =>
      this.jpDeliverableRepo.create({
        job_profile_deliverable_id: jpd.job_profile_deliverable_id,
        job_profile_id: jpd.job_profile_id,
        // Combine KPA, KPIs, and responsibilities into deliverable field
        deliverable: [jpd.kpa, jpd.kpis, jpd.responsibilities]
          .filter(Boolean)
          .join(' | '),
        sequence: jpd.weight || 1, // Use weight as sequence
        status: jpd.status || 'Active',
      }),
    );

    // Save in batches
    const batchSize = 500;
    for (let i = 0; i < deliverables.length; i += batchSize) {
      const batch = deliverables.slice(i, i + batchSize);
      await this.jpDeliverableRepo.save(batch);
    }

    this.logger.log(
      `✅ Imported ${deliverables.length} job profile deliverables`,
    );
  }

  private async importJobProfileRequirements(profileIds: number[]) {
    const data = require('../../exqi-export/job_profile_requirements.json');
    const filtered = data.filter((jpr) =>
      profileIds.includes(jpr.job_profile_id),
    );

    if (filtered.length === 0) return;

    await this.jpRequirementRepo.delete({});

    const requirements = filtered.map((jpr) =>
      this.jpRequirementRepo.create({
        job_profile_requirement_id: jpr.job_profile_requirement_id,
        job_profile_id: jpr.job_profile_id,
        // Map EXQi fields to Nexus fields
        education: [jpr.minimum_qualification, jpr.preferred_qualification]
          .filter(Boolean)
          .join(' | '),
        experience: jpr.work_experience,
        certifications: [
          jpr.certification,
          jpr.professional_body_registration,
        ]
          .filter(Boolean)
          .join(' | '),
        other_requirements: jpr.knowledge,
      }),
    );

    // Save in batches
    const batchSize = 500;
    for (let i = 0; i < requirements.length; i += batchSize) {
      const batch = requirements.slice(i, i + batchSize);
      await this.jpRequirementRepo.save(batch);
    }

    this.logger.log(
      `✅ Imported ${requirements.length} job profile requirements`,
    );
  }
}

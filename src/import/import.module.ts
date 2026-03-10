import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './import.service';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      JobGrade,
      WorkLevel,
      Skill,
      JobProfile,
      JobProfileCompetency,
      JobProfileSkill,
      JobProfileDeliverable,
      JobProfileRequirement,
      Competency,
      CompetencyType,
      Client,
    ]),
  ],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobProfilesService } from './job-profiles.service';
import { JobProfilesController } from './job-profiles.controller';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobProfile,
      JobProfileCompetency,
      JobProfileSkill,
      JobProfileDeliverable,
      JobProfileRequirement,
    ]),
  ],
  controllers: [JobProfilesController],
  providers: [JobProfilesService],
  exports: [JobProfilesService],
})
export class JobProfilesModule {}

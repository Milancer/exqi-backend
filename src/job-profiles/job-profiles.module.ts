import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobProfilesService } from './job-profiles.service';
import { JobProfilesController } from './job-profiles.controller';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';
import { JpCompetencyType } from './entities/jp-competency-type.entity';
import { JpCompetencyCluster } from './entities/jp-competency-cluster.entity';
import { JpCompetency } from './entities/jp-competency.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobProfile,
      JobProfileCompetency,
      JobProfileSkill,
      JobProfileDeliverable,
      JobProfileRequirement,
      JpCompetencyType,
      JpCompetencyCluster,
      JpCompetency,
      User,
    ]),
    NotificationsModule,
  ],
  controllers: [JobProfilesController],
  providers: [JobProfilesService],
  exports: [JobProfilesService],
})
export class JobProfilesModule {}

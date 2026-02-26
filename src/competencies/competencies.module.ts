import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { Competency } from './entities/competency.entity';
import { CompetencyType } from './entities/competency-type.entity';
import { CompetencyCluster } from './entities/competency-cluster.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competency, CompetencyType, CompetencyCluster]),
  ],
  providers: [CompetenciesService],
  controllers: [CompetenciesController],
  exports: [CompetenciesService],
})
export class CompetenciesModule {}

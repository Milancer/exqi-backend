import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// JP competency entities
import { JpCompetencyType } from '../job-profiles/entities/jp-competency-type.entity';
import { JpCompetencyCluster } from '../job-profiles/entities/jp-competency-cluster.entity';
import { JpCompetency } from '../job-profiles/entities/jp-competency.entity';

// CBI competency entities
import { CompetencyType } from '../competencies/entities/competency-type.entity';
import { CompetencyCluster } from '../competencies/entities/competency-cluster.entity';
import { Competency } from '../competencies/entities/competency.entity';
import { CompetencyQuestion } from '../cbi/entities/competency-question.entity';
import { BulkImportController } from './bulk-import.controller';
import { BulkImportService } from './bulk-import.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JpCompetencyType,
      JpCompetencyCluster,
      JpCompetency,
      CompetencyType,
      CompetencyCluster,
      Competency,
      CompetencyQuestion,
    ]),
  ],
  controllers: [BulkImportController],
  providers: [BulkImportService],
})
export class BulkImportModule {}

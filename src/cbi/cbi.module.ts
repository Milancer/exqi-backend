import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CbiService } from './cbi.service';
import { CbiController } from './cbi.controller';
import { QuestionsController } from './questions.controller';
import { CbiTemplate } from './entities/cbi-template.entity';
import { CompetencyQuestion } from './entities/competency-question.entity';
import { CompetencyInterview } from './entities/competency-interview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CbiTemplate,
      CompetencyQuestion,
      CompetencyInterview,
    ]),
  ],
  controllers: [CbiController, QuestionsController],
  providers: [CbiService],
  exports: [CbiService],
})
export class CbiModule {}

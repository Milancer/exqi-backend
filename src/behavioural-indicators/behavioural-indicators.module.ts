import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BehaviouralIndicatorsController } from './behavioural-indicators.controller';
import { BehaviouralIndicatorsService } from './behavioural-indicators.service';
import { BiCompetency } from './entities/bi-competency.entity';
import { BiLevel } from './entities/bi-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BiCompetency, BiLevel])],
  controllers: [BehaviouralIndicatorsController],
  providers: [BehaviouralIndicatorsService],
  exports: [BehaviouralIndicatorsService],
})
export class BehaviouralIndicatorsModule {}

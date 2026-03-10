import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkLevelsController } from './work-levels.controller';
import { WorkLevelsService } from './work-levels.service';
import { WorkLevel } from './entities/work-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkLevel])],
  controllers: [WorkLevelsController],
  providers: [WorkLevelsService],
  exports: [WorkLevelsService],
})
export class WorkLevelsModule {}

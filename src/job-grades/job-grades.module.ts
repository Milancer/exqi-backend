import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobGradesController } from './job-grades.controller';
import { JobGradesService } from './job-grades.service';
import { JobGrade } from './entities/job-grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobGrade])],
  controllers: [JobGradesController],
  providers: [JobGradesService],
  exports: [JobGradesService],
})
export class JobGradesModule {}

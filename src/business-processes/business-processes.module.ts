import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProcessNode } from './entities/business-process-node.entity';
import { JobProfileBusinessProcess } from './entities/job-profile-business-process.entity';
import { BusinessProcessesService } from './business-processes.service';
import { BusinessProcessesController } from './business-processes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessProcessNode, JobProfileBusinessProcess])],
  controllers: [BusinessProcessesController],
  providers: [BusinessProcessesService],
  exports: [BusinessProcessesService, TypeOrmModule],
})
export class BusinessProcessesModule {}

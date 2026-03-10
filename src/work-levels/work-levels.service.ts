import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkLevel } from './entities/work-level.entity';

@Injectable()
export class WorkLevelsService {
  constructor(
    @InjectRepository(WorkLevel)
    private readonly workLevelRepository: Repository<WorkLevel>,
  ) {}

  async findAll() {
    return this.workLevelRepository.find({
      where: { status: 'Active' },
      order: { work_level_id: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.workLevelRepository.findOne({
      where: { work_level_id: id },
    });
  }
}

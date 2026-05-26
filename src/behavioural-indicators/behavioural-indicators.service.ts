import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiCompetency } from './entities/bi-competency.entity';

@Injectable()
export class BehaviouralIndicatorsService {
  constructor(
    @InjectRepository(BiCompetency)
    private readonly repo: Repository<BiCompetency>,
  ) {}

  async findAll(): Promise<BiCompetency[]> {
    const rows = await this.repo.find({
      relations: ['levels'],
      order: { sort_order: 'ASC', bi_competency_id: 'ASC' },
    });
    for (const r of rows) {
      r.levels.sort((a, b) => a.level - b.level);
    }
    return rows;
  }
}

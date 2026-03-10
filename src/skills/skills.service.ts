import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findAll() {
    return this.skillRepository.find({
      where: { status: 'Active' },
      order: { skill: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.skillRepository.findOne({
      where: { skill_id: id },
    });
  }
}

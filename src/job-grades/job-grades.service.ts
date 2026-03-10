import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { JobGrade } from './entities/job-grade.entity';

@Injectable()
export class JobGradesService {
  constructor(
    @InjectRepository(JobGrade)
    private readonly jobGradeRepository: Repository<JobGrade>,
  ) {}

  async findAll() {
    return this.jobGradeRepository.find({
      where: [{ status: 'Active' }, { status: IsNull() }],
      order: { job_grade_id: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.jobGradeRepository.findOne({
      where: { job_grade_id: id },
    });
  }
}

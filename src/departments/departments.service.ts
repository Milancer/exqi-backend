import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll() {
    return this.departmentRepository.find({
      where: { status: 'Active' },
      order: { department: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.departmentRepository.findOne({
      where: { department_id: id },
    });
  }
}

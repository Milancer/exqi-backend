import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(user: any) {
    const query = this.departmentRepository
      .createQueryBuilder('d')
      .where('d.status = :status', { status: 'Active' })
      .orderBy('d.department', 'ASC');

    // Same tenancy rule as job profiles: ADMIN sees every client's reference
    // data, everyone else is confined to their own.
    if (user?.role !== UserRole.ADMIN) {
      query.andWhere('d.client_id = :clientId', { clientId: user?.clientId });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    return this.departmentRepository.findOne({
      where: { department_id: id },
    });
  }

  async create(dto: CreateDepartmentDto, user: any) {
    const name = (dto.department || '').trim();
    if (!name) {
      throw new BadRequestException('Department name is required');
    }

    const clientId = user?.clientId;

    // Anyone who can create a job profile can create a department, so the
    // only thing keeping "Finance" from becoming "finance" and "Finance " is
    // this lookup. Returning the existing row rather than throwing keeps the
    // endpoint idempotent — the dropdown just selects whatever comes back.
    const existing = await this.departmentRepository
      .createQueryBuilder('d')
      .where('LOWER(BTRIM(d.department)) = LOWER(:name)', { name })
      .andWhere('d.client_id = :clientId', { clientId })
      .andWhere('d.status != :deleted', { deleted: 'Deleted' })
      .getOne();

    if (existing) {
      return existing;
    }

    const department = this.departmentRepository.create({
      department: name,
      client_id: clientId,
      status: 'Active',
    });

    return this.departmentRepository.save(department);
  }
}

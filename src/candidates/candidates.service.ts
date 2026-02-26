import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate, CandidateStatus } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly repo: Repository<Candidate>,
  ) {}

  async create(dto: CreateCandidateDto, user: any): Promise<Candidate> {
    const candidate = this.repo.create({
      ...dto,
      client_id: user.role === UserRole.ADMIN ? 1 : user.clientId,
    });
    return this.repo.save(candidate);
  }

  async findAll(user: any): Promise<Candidate[]> {
    if (user.role === UserRole.ADMIN) {
      return this.repo.find({
        where: { status: CandidateStatus.ACTIVE },
        order: { created_at: 'DESC' },
      });
    }
    return this.repo.find({
      where: { client_id: user.clientId, status: CandidateStatus.ACTIVE },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, user: any): Promise<Candidate> {
    const candidate = await this.repo.findOne({
      where: { candidate_id: id },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');
    if (user.role !== UserRole.ADMIN && candidate.client_id !== user.clientId) {
      throw new ForbiddenException();
    }
    return candidate;
  }

  async update(
    id: number,
    dto: UpdateCandidateDto,
    user: any,
  ): Promise<Candidate> {
    const candidate = await this.findOne(id, user);
    Object.assign(candidate, dto);
    return this.repo.save(candidate);
  }

  async remove(id: number, user: any): Promise<Candidate> {
    const candidate = await this.findOne(id, user);
    candidate.status = CandidateStatus.ARCHIVED;
    return this.repo.save(candidate);
  }
}

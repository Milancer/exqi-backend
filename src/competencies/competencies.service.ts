import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competency } from './entities/competency.entity';
import { CompetencyType } from './entities/competency-type.entity';
import { CompetencyCluster } from './entities/competency-cluster.entity';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { CreateCompetencyTypeDto } from './dto/competency-type/create-competency-type.dto';
import { UpdateCompetencyTypeDto } from './dto/competency-type/update-competency-type.dto';
import { CreateCompetencyClusterDto } from './dto/competency-cluster/create-competency-cluster.dto';
import { UpdateCompetencyClusterDto } from './dto/competency-cluster/update-competency-cluster.dto';
import { UserRole } from '../users/entities/user.entity';

// Roles permitted to manage competency taxonomy (CBI + Job Profile sides).
// Defence-in-depth check alongside the @Roles() decorators on the
// controller. Keep this list in sync with TAXONOMY_WRITE_ROLES in
// competencies.controller.ts and job-profiles.controller.ts.
const TAXONOMY_WRITE_ROLES: readonly UserRole[] = [
  UserRole.ADMIN,
  UserRole.OFFICE_MANAGER,
  UserRole.CBI_USER,
  UserRole.JOB_PROFILE_USER,
];

export function assertCanManageTaxonomy(user: any, resource: string): void {
  if (!TAXONOMY_WRITE_ROLES.includes(user?.role)) {
    throw new ForbiddenException(
      `Your role is not permitted to modify ${resource}`,
    );
  }
}

@Injectable()
export class CompetenciesService {
  constructor(
    @InjectRepository(Competency)
    private readonly repository: Repository<Competency>,
    @InjectRepository(CompetencyType)
    private readonly typeRepository: Repository<CompetencyType>,
    @InjectRepository(CompetencyCluster)
    private readonly clusterRepository: Repository<CompetencyCluster>,
  ) {}

  /**
   * Create a new competency (ADMIN, OFFICE_MANAGER, CBI_USER)
   */
  async create(createCompetencyDto: CreateCompetencyDto, currentUser: any) {
    assertCanManageTaxonomy(currentUser, 'competencies');

    const competency = this.repository.create({
      ...createCompetencyDto,
      client_id: currentUser.clientId || 1,
    });
    return this.repository.save(competency);
  }

  /**
   * Find all competencies with multi-tenancy filtering
   * - ADMIN sees all competencies
   * - Others see Client 1 (global) competencies only
   */
  async findAll(currentUser: any) {
    // Admins can see all competencies
    if (currentUser.role === UserRole.ADMIN) {
      return this.repository.find({
        relations: ['competencyType'],
        where: { status: 'Active' },
      });
    }

    // Regular users can only see global competencies (Client 1)
    // Note: Competencies are global resources, not multi-tenant
    return this.repository.find({
      relations: ['competencyType'],
      where: { status: 'Active' },
    });
  }

  /**
   * Find one competency by ID
   */
  async findOne(id: number, currentUser: any) {
    const competency = await this.repository.findOne({
      where: { competency_id: id },
      relations: ['competencyType'],
    });

    if (!competency) {
      throw new NotFoundException('Competency not found');
    }

    return competency;
  }

  /**
   * Update a competency (ADMIN, OFFICE_MANAGER, CBI_USER)
   */
  async update(
    id: number,
    updateCompetencyDto: UpdateCompetencyDto,
    currentUser: any,
  ) {
    assertCanManageTaxonomy(currentUser, 'competencies');

    await this.findOne(id, currentUser);

    await this.repository.update(id, updateCompetencyDto);
    return this.repository.findOne({
      where: { competency_id: id },
      relations: ['competencyType'],
    });
  }

  /**
   * Soft delete a competency (ADMIN, OFFICE_MANAGER, CBI_USER)
   */
  async remove(id: number, currentUser: any) {
    assertCanManageTaxonomy(currentUser, 'competencies');

    await this.findOne(id, currentUser);
    await this.repository.update(id, { status: 'Deleted' });
    return { message: 'Competency deleted successfully' };
  }

  // CompetencyType CRUD
  async createType(dto: CreateCompetencyTypeDto, user: any) {
    assertCanManageTaxonomy(user, 'competency types');
    const type = this.typeRepository.create({
      ...dto,
      client_id: user.clientId || 1,
    });
    return this.typeRepository.save(type);
  }

  async findAllTypes() {
    return this.typeRepository.find({ where: { status: 'Active' } });
  }

  async findOneType(id: number) {
    const type = await this.typeRepository.findOne({
      where: { competency_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`CompetencyType with ID ${id} not found`);
    }
    return type;
  }

  async updateType(id: number, dto: UpdateCompetencyTypeDto, user: any) {
    assertCanManageTaxonomy(user, 'competency types');
    await this.findOneType(id);
    await this.typeRepository.update(id, dto);
    return this.findOneType(id);
  }

  async removeType(id: number, user: any) {
    assertCanManageTaxonomy(user, 'competency types');
    await this.findOneType(id);
    await this.typeRepository.update(id, { status: 'Deleted' });
    return { message: 'CompetencyType deleted successfully' };
  }

  // CompetencyCluster CRUD
  async createCluster(dto: CreateCompetencyClusterDto, user: any) {
    assertCanManageTaxonomy(user, 'competency clusters');
    const cluster = this.clusterRepository.create({
      ...dto,
      client_id: user.clientId || 1,
    });
    return this.clusterRepository.save(cluster);
  }

  async findAllClusters() {
    return this.clusterRepository.find({
      where: { status: 'Active' },
      relations: ['competencyType'],
    });
  }

  async findOneCluster(id: number) {
    const cluster = await this.clusterRepository.findOne({
      where: { competency_cluster_id: id },
      relations: ['competencyType'],
    });
    if (!cluster) {
      throw new NotFoundException(`CompetencyCluster with ID ${id} not found`);
    }
    return cluster;
  }

  async updateCluster(id: number, dto: UpdateCompetencyClusterDto, user: any) {
    assertCanManageTaxonomy(user, 'competency clusters');
    await this.findOneCluster(id);
    await this.clusterRepository.update(id, dto);
    return this.findOneCluster(id);
  }

  async removeCluster(id: number, user: any) {
    assertCanManageTaxonomy(user, 'competency clusters');
    await this.findOneCluster(id);
    await this.clusterRepository.update(id, { status: 'Deleted' });
    return { message: 'CompetencyCluster deleted successfully' };
  }
}

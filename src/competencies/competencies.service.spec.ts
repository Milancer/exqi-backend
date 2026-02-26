import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { Competency } from './entities/competency.entity';
import { CompetencyType } from './entities/competency-type.entity';
import { CompetencyCluster } from './entities/competency-cluster.entity';
import { UserRole } from '../users/entities/user.entity';

describe('CompetenciesService', () => {
  let service: CompetenciesService;
  let repository: Repository<Competency>;

  const mockCompetency = {
    competency_id: 1,
    competency_type_id: 1,
    competency_cluster_id: 1,
    competency: 'Problem Solving',
    description: 'Ability to solve complex problems',
    indicators: 'Identifies root causes',
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAdminUser = {
    userId: 1,
    clientId: 1,
    role: UserRole.ADMIN,
  };

  const mockRegularUser = {
    userId: 2,
    clientId: 2,
    role: UserRole.OFFICE_USER,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetenciesService,
        {
          provide: getRepositoryToken(Competency),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CompetencyType),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CompetencyCluster),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompetenciesService>(CompetenciesService);
    repository = module.get<Repository<Competency>>(
      getRepositoryToken(Competency),
    );

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should allow ADMIN to create competencies', async () => {
      const createDto = {
        competency_type_id: 1,
        competency_cluster_id: 1,
        competency: 'New Competency',
        description: 'Test description',
      };

      mockRepository.create.mockReturnValue(mockCompetency);
      mockRepository.save.mockResolvedValue(mockCompetency);

      const result = await service.create(createDto, mockAdminUser);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCompetency);
    });

    it('should prevent non-ADMIN from creating competencies', async () => {
      const createDto = {
        competency_type_id: 1,
        competency_cluster_id: 1,
        competency: 'New Competency',
      };

      await expect(service.create(createDto, mockRegularUser)).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should allow ADMIN to view all competencies', async () => {
      const competencies = [mockCompetency];
      mockRepository.find.mockResolvedValue(competencies);

      const result = await service.findAll(mockAdminUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['competencyType', 'competencyCluster'],
        where: { status: 'Active' },
      });
      expect(result).toEqual(competencies);
    });

    it('should allow non-ADMIN users to see active competencies', async () => {
      const competencies = [mockCompetency];
      mockRepository.find.mockResolvedValue(competencies);

      const result = await service.findAll(mockRegularUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['competencyType', 'competencyCluster'],
        where: { status: 'Active' },
      });
      expect(result).toEqual(competencies);
    });
  });

  describe('findOne', () => {
    it('should return a competency when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompetency);

      const result = await service.findOne(1, mockAdminUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { competency_id: 1 },
        relations: ['competencyType', 'competencyCluster'],
      });
      expect(result).toEqual(mockCompetency);
    });

    it('should throw NotFoundException when competency not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, mockAdminUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should allow ADMIN to update competencies', async () => {
      const updateDto = { competency: 'Updated Competency' };
      const updatedCompetency = { ...mockCompetency, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockCompetency);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedCompetency);

      const result = await service.update(1, updateDto, mockAdminUser);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedCompetency);
    });

    it('should prevent non-ADMIN from updating competencies', async () => {
      const updateDto = { competency: 'Updated Competency' };

      await expect(
        service.update(1, updateDto, mockRegularUser),
      ).rejects.toThrow(ForbiddenException);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should allow ADMIN to soft delete competencies', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompetency);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1, mockAdminUser);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        status: 'Deleted',
      });
      expect(result).toEqual({ message: 'Competency deleted successfully' });
    });

    it('should prevent non-ADMIN from deleting competencies', async () => {
      await expect(service.remove(1, mockRegularUser)).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });
});

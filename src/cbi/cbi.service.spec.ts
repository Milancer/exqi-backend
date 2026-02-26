import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CbiService } from './cbi.service';
import { CbiTemplate } from './entities/cbi-template.entity';
import { CompetencyQuestion } from './entities/competency-question.entity';
import { UserRole } from '../users/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CbiService', () => {
  let service: CbiService;
  let mockRepository: any;

  const mockAdminUser = { clientId: 1, role: UserRole.ADMIN };
  const mockOfficeUser = { clientId: 2, role: UserRole.OFFICE_MANAGER };

  const mockTemplate = {
    cbi_template_id: 1,
    template_name: 'Test Template',
    description: 'Test Description',
    client_id: 1,
    question_limits: { use_global_limit: true, global_limit: 3 },
    status: 'Active',
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn((dto) => dto),
      save: jest.fn((template) =>
        Promise.resolve({ ...template, cbi_template_id: 1 }),
      ),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CbiService,
        {
          provide: getRepositoryToken(CbiTemplate),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CompetencyQuestion),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CbiService>(CbiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTemplate', () => {
    it('should allow ADMIN to create template', async () => {
      const dto = {
        template_name: 'New Template',
        description: 'Description',
      };

      const result = await service.createTemplate(dto, mockAdminUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        client_id: mockAdminUser.clientId,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.cbi_template_id).toBe(1);
    });

    it('should prevent non-ADMIN from creating template', async () => {
      const dto = { template_name: 'Test' };

      await expect(service.createTemplate(dto, mockOfficeUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAllTemplates', () => {
    it('should return all templates for ADMIN', async () => {
      mockRepository.find.mockResolvedValue([mockTemplate]);

      const result = await service.findAllTemplates(mockAdminUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'Active' },
      });
      expect(result).toEqual([mockTemplate]);
    });

    it('should return only client templates for non-ADMIN', async () => {
      mockRepository.find.mockResolvedValue([mockTemplate]);

      await service.findAllTemplates(mockOfficeUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'Active', client_id: mockOfficeUser.clientId },
      });
    });
  });

  describe('findOneTemplate', () => {
    it('should return template if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await service.findOneTemplate(1, mockAdminUser);

      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException if template not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneTemplate(999, mockAdminUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should prevent non-ADMIN from accessing other client templates', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);

      await expect(service.findOneTemplate(1, mockOfficeUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateTemplate', () => {
    it('should allow ADMIN to update template', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);
      const updateDto = { template_name: 'Updated' };

      await service.updateTemplate(1, updateDto, mockAdminUser);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should prevent non-ADMIN from updating template', async () => {
      await expect(
        service.updateTemplate(1, {}, mockOfficeUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeTemplate', () => {
    it('should allow ADMIN to soft delete template', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await service.removeTemplate(1, mockAdminUser);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        status: 'Deleted',
      });
      expect(result.message).toBe('CBI Template deleted successfully');
    });

    it('should prevent non-ADMIN from deleting template', async () => {
      await expect(service.removeTemplate(1, mockOfficeUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

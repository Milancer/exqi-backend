import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciesController } from './competencies.controller';
import { CompetenciesService } from './competencies.service';

describe('CompetenciesController', () => {
  let controller: CompetenciesController;

  const mockCompetenciesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetenciesController],
      providers: [
        {
          provide: CompetenciesService,
          useValue: mockCompetenciesService,
        },
      ],
    }).compile();

    controller = module.get<CompetenciesController>(CompetenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

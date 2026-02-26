import { Test, TestingModule } from '@nestjs/testing';
import { JobProfilesController } from './job-profiles.controller';
import { JobProfilesService } from './job-profiles.service';

describe('JobProfilesController', () => {
  let controller: JobProfilesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addCompetency: jest.fn(),
    removeCompetency: jest.fn(),
    addSkill: jest.fn(),
    removeSkill: jest.fn(),
    addDeliverable: jest.fn(),
    removeDeliverable: jest.fn(),
    updateRequirements: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobProfilesController],
      providers: [
        {
          provide: JobProfilesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<JobProfilesController>(JobProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

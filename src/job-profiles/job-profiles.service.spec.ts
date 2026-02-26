import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobProfilesService } from './job-profiles.service';
import { JobProfile } from './entities/job-profile.entity';
import { JobProfileCompetency } from './entities/job-profile-competency.entity';
import { JobProfileSkill } from './entities/job-profile-skill.entity';
import { JobProfileDeliverable } from './entities/job-profile-deliverable.entity';
import { JobProfileRequirement } from './entities/job-profile-requirement.entity';

describe('JobProfilesService', () => {
  let service: JobProfilesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobProfilesService,
        {
          provide: getRepositoryToken(JobProfile),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(JobProfileCompetency),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(JobProfileSkill),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(JobProfileDeliverable),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(JobProfileRequirement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<JobProfilesService>(JobProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

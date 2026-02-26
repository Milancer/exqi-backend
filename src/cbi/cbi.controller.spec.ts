import { Test, TestingModule } from '@nestjs/testing';
import { CbiController } from './cbi.controller';
import { CbiService } from './cbi.service';

describe('CbiController', () => {
  let controller: CbiController;

  const mockCbiService = {
    createTemplate: jest.fn(),
    findAllTemplates: jest.fn(),
    findOneTemplate: jest.fn(),
    updateTemplate: jest.fn(),
    removeTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CbiController],
      providers: [
        {
          provide: CbiService,
          useValue: mockCbiService,
        },
      ],
    }).compile();

    controller = module.get<CbiController>(CbiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

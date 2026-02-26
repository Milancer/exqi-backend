import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleGuard } from './module.guard';
import { ClientModule } from '../clients/entities/client.entity';
import { UserRole } from '../users/entities/user.entity';

describe('ModuleGuard', () => {
  let guard: ModuleGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<ModuleGuard>(ModuleGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  const createMockContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no modules are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);

    const mockUser = {
      userId: 1,
      role: UserRole.OFFICE_USER,
      modules: [],
    };
    const context = createMockContext(mockUser);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow ADMIN to bypass all module checks', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      ClientModule.COMPETENCY_BASED_INTERVIEW,
    ]);

    const mockAdminUser = {
      userId: 1,
      role: UserRole.ADMIN,
      modules: [], // No modules assigned
    };
    const context = createMockContext(mockAdminUser);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return true if user has the required module', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      ClientModule.COMPETENCY_BASED_INTERVIEW,
    ]);

    const mockUser = {
      userId: 2,
      role: UserRole.OFFICE_MANAGER,
      modules: [ClientModule.COMPETENCY_BASED_INTERVIEW],
    };
    const context = createMockContext(mockUser);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false if user lacks the required module', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      ClientModule.COMPETENCY_BASED_INTERVIEW,
    ]);

    const mockUser = {
      userId: 3,
      role: UserRole.OFFICE_USER,
      modules: [ClientModule.JOB_PROFILE], // Different module
    };
    const context = createMockContext(mockUser);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should work with multiple module requirements', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      ClientModule.COMPETENCY_BASED_INTERVIEW,
      ClientModule.JOB_PROFILE,
    ]);

    const mockUser = {
      userId: 4,
      role: UserRole.OFFICE_MANAGER,
      modules: [ClientModule.JOB_PROFILE], // Has one of the required modules
    };
    const context = createMockContext(mockUser);

    expect(guard.canActivate(context)).toBe(true);
  });
});

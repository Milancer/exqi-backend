import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULES_KEY } from './require-module.decorator';
import { ClientModule } from '../clients/entities/client.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModules = this.reflector.getAllAndOverride<ClientModule[]>(
      MODULES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no modules are required, allow access
    if (!requiredModules || requiredModules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ADMIN users bypass all module checks
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check if user has at least one of the required modules
    const userModules = user.modules || [];
    return requiredModules.some((module) => userModules.includes(module));
  }
}

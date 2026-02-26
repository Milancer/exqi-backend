import { SetMetadata } from '@nestjs/common';
import { ClientModule } from '../clients/entities/client.entity';

export const MODULES_KEY = 'modules';
export const RequireModule = (...modules: ClientModule[]) =>
  SetMetadata(MODULES_KEY, modules);

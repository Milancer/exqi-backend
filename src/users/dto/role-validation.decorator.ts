import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export function IsValidRoleForClient(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidRoleForClient',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const role = obj.role;
          const clientId = obj.clientId;

          // ADMIN role must belong to Client 1 (System)
          if (role === UserRole.ADMIN && clientId !== 1) {
            return false;
          }

          // OFFICE roles cannot belong to Client 1
          if (
            (role === UserRole.OFFICE_MANAGER ||
              role === UserRole.OFFICE_USER) &&
            clientId === 1
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as any;
          const role = obj.role;
          const clientId = obj.clientId;

          if (role === UserRole.ADMIN && clientId !== 1) {
            return 'ADMIN role is only allowed for system users (Client ID = 1)';
          }

          if (
            (role === UserRole.OFFICE_MANAGER ||
              role === UserRole.OFFICE_USER) &&
            clientId === 1
          ) {
            return 'Office roles (OFFICE_MANAGER, OFFICE_USER) cannot belong to system client (Client ID = 1)';
          }

          return 'Invalid role and client combination';
        },
      },
    });
  };
}

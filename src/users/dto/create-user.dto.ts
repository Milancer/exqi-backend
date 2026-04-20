import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';
import { IsValidRoleForClient } from './role-validation.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description:
      'Optional - if not provided, user will receive email to set password',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description:
      'Client ID - Must be 1 for ADMIN role, must be > 1 for office roles',
  })
  @IsNumber()
  @IsValidRoleForClient({ message: 'Invalid role and client combination' })
  clientId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profilePicture?: string;
}

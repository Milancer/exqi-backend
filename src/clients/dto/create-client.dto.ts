import { IsString, IsEmail, IsOptional, IsNotEmpty, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientModule } from '../entities/client.entity';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  division: string;

  // Primary Contact
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactSurname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPhoneNumber: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  // HR Contact
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hrContactName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hrContactSurname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hrContactPhoneNumber: string;

  @ApiProperty()
  @IsEmail()
  hrContactEmail: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ enum: ClientModule, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ClientModule, { each: true })
  modules?: ClientModule[];
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new client (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created.',
    type: Client,
  })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('modules')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all available modules (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of available modules.' })
  getModules() {
    return this.clientsService.getModules();
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Retrieve all visible clients (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all clients.',
    type: [Client],
  })
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Retrieve a client by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The client details.',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({
    status: 200,
    description: 'The updated client.',
    type: Client,
  })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a client (Admin only)' })
  @ApiResponse({ status: 200, description: 'The client has been deleted.' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}

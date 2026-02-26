import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientModule } from './entities/client.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  getModules() {
    return Object.values(ClientModule);
  }

  async findAll(user: any) {
    // ADMIN sees all clients
    if (user.role === UserRole.ADMIN) {
      return this.clientsRepository.find();
    }
    // Others see their own client AND the System Client (Read-Only)
    return this.clientsRepository.find({
      where: [{ id: user.clientId }, { id: 1 }],
    });
  }

  async findOne(id: number, user: any) {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) throw new NotFoundException('Client not found');

    // ADMIN can see any client
    if (user.role === UserRole.ADMIN) return client;

    // Users can only see their own client OR the System Client
    if (client.id !== user.clientId && client.id !== 1) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.clientsRepository.update(id, updateClientDto);
    return this.clientsRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.clientsRepository.delete(id);
  }
}

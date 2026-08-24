import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Client } from '@/modules/clients/entities/client.entity';
import { CreateClientDto } from '@/modules/clients/dto/create-client.dto';
import { UpdateClientDto } from '@/modules/clients/dto/update-client.dto';
import { ClientResponseDto } from '@/modules/clients/dto/client-response.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<ClientResponseDto[]> {
    const clients = await this.clientRepository.find({
      order: { createdAt: 'DESC' },
    });
    return clients.map((c) => ClientResponseDto.fromEntity(c));
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.findById(id);
    Object.assign(client, updateClientDto);
    const updated = await this.clientRepository.save(client);
    return ClientResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findById(id);
    await this.clientRepository.remove(client);
  }
}

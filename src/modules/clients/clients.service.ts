import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Client } from '@/modules/clients/entities/client.entity';
import { CreateClientDto } from '@/modules/clients/dto/create-client.dto';
import { UpdateClientDto } from '@/modules/clients/dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    consultantId?: string,
  ): Promise<Client> {
    if (createClientDto.email || createClientDto.phone) {
      const existing = await this.clientRepository.findOne({
        where: [
          ...(createClientDto.email
            ? [{ email: createClientDto.email.toLowerCase() }]
            : []),
          ...(createClientDto.phone ? [{ phone: createClientDto.phone }] : []),
        ],
      });
      if (existing) {
        return existing;
      }
    }

    const client = new Client();
    client.name = createClientDto.name;
    if (createClientDto.email) {
      client.email = createClientDto.email.toLowerCase();
    }
    if (createClientDto.phone) {
      client.phone = createClientDto.phone;
    }
    if (createClientDto.country) {
      client.country = createClientDto.country;
    }
    if (createClientDto.address) {
      client.address = createClientDto.address;
    }
    if (createClientDto.passportNumber) {
      client.passportNumber = createClientDto.passportNumber;
    }
    if (createClientDto.notes) {
      client.notes = createClientDto.notes;
    }
    if (createClientDto.dateOfBirth) {
      client.dateOfBirth = new Date(createClientDto.dateOfBirth);
    }
    client.consultantId = createClientDto.consultantId ?? consultantId ?? null;

    return this.clientRepository.save(client);
  }

  async findAll(consultantId?: string): Promise<Client[]> {
    const whereCondition = consultantId ? { consultantId } : {};
    return this.clientRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    Object.assign(client, updateClientDto);
    if (updateClientDto.dateOfBirth) {
      client.dateOfBirth = new Date(updateClientDto.dateOfBirth);
    }
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findById(id);
    await this.clientRepository.remove(client);
  }
}

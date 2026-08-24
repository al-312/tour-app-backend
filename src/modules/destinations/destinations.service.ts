import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Destination } from '@/modules/destinations/entities/destination.entity';
import { CreateDestinationDto } from '@/modules/destinations/dto/create-destination.dto';
import { UpdateDestinationDto } from '@/modules/destinations/dto/update-destination.dto';
import { DestinationResponseDto } from '@/modules/destinations/dto/destination-response.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const destination = this.destinationRepository.create(createDestinationDto);
    return await this.destinationRepository.save(destination);
  }

  async findAll(): Promise<DestinationResponseDto[]> {
    const destinations = await this.destinationRepository.find({
      order: { name: 'ASC' },
    });
    return destinations.map((d) => DestinationResponseDto.fromEntity(d));
  }

  async findById(id: string): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({
      where: { id },
      relations: { hotels: true },
    });

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    return destination;
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    const destination = await this.findById(id);
    Object.assign(destination, updateDestinationDto);
    const updated = await this.destinationRepository.save(destination);
    return DestinationResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const destination = await this.findById(id);
    await this.destinationRepository.remove(destination);
  }
}

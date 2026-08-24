import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { CreateHotelDto } from '@/modules/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from '@/modules/hotels/dto/update-hotel.dto';
import { HotelResponseDto } from '@/modules/hotels/dto/hotel-response.dto';
import { Destination } from '@/modules/destinations/entities/destination.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const { destinationId, name, starRating } = createHotelDto;

    if (destinationId) {
      const destination = await this.destinationRepository.findOne({
        where: { id: destinationId },
      });
      if (!destination) {
        throw new NotFoundException(
          `Destination with ID ${destinationId} not found`,
        );
      }
    }

    const hotel = this.hotelRepository.create({
      name,
      starRating,
      destinationId: destinationId ?? null,
    });

    const saved = await this.hotelRepository.save(hotel);
    return this.findById(saved.id);
  }

  async findAll(destinationId?: string): Promise<HotelResponseDto[]> {
    const whereCondition = destinationId ? { destinationId } : {};
    const hotels = await this.hotelRepository.find({
      where: whereCondition,
      relations: { destination: true },
      order: { createdAt: 'DESC' },
    });
    return hotels.map((h) => HotelResponseDto.fromEntity(h));
  }

  async findById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: { destination: true },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }

    return hotel;
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
  ): Promise<HotelResponseDto> {
    const hotel = await this.findById(id);

    if (
      updateHotelDto.destinationId &&
      updateHotelDto.destinationId !== hotel.destinationId
    ) {
      const destination = await this.destinationRepository.findOne({
        where: { id: updateHotelDto.destinationId },
      });
      if (!destination) {
        throw new NotFoundException(
          `Destination with ID ${updateHotelDto.destinationId} not found`,
        );
      }
    }

    if (updateHotelDto.name !== undefined) {
      hotel.name = updateHotelDto.name;
    }
    if (updateHotelDto.starRating !== undefined) {
      hotel.starRating = updateHotelDto.starRating;
    }
    if (updateHotelDto.destinationId !== undefined) {
      hotel.destinationId = updateHotelDto.destinationId ?? null;
    }

    await this.hotelRepository.save(hotel);
    const updated = await this.findById(id);
    return HotelResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.findById(id);
    await this.hotelRepository.remove(hotel);
  }
}

import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { CreateHotelDto } from '@/modules/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from '@/modules/hotels/dto/update-hotel.dto';
import { CreateRoomTypeDto } from '@/modules/hotels/dto/create-room-type.dto';
import { Destination } from '@/modules/destinations/entities/destination.entity';
import {
  calculateRoomAllocation,
  RoomAllocationResult,
} from '@/modules/hotels/utils/room-allocation.util';

export type { RoomAllocationResult };

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const { destinationId, name, starRating, roomTypeIds } = createHotelDto;

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

    let roomTypes: RoomType[] = [];
    if (roomTypeIds && roomTypeIds.length > 0) {
      roomTypes = await this.roomTypeRepository.findBy({ id: In(roomTypeIds) });
    }

    const hotel = this.hotelRepository.create({
      name,
      starRating,
      destinationId: destinationId ?? null,
      roomTypes,
    });

    const saved = await this.hotelRepository.save(hotel);
    return this.findById(saved.id);
  }

  async findAll(destinationId?: string): Promise<Hotel[]> {
    const whereCondition = destinationId ? { destinationId } : {};
    return this.hotelRepository.find({
      where: whereCondition,
      relations: { destination: true, roomTypes: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: { destination: true, roomTypes: true },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }

    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
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
    if (updateHotelDto.roomTypeIds !== undefined) {
      if (updateHotelDto.roomTypeIds.length > 0) {
        hotel.roomTypes = await this.roomTypeRepository.findBy({
          id: In(updateHotelDto.roomTypeIds),
        });
      } else {
        hotel.roomTypes = [];
      }
    }

    await this.hotelRepository.save(hotel);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.findById(id);
    await this.hotelRepository.remove(hotel);
  }

  // Master Catalog Room Types (Independent)
  async createRoomType(
    createRoomTypeDto: CreateRoomTypeDto,
    hotelId?: string,
  ): Promise<RoomType> {
    const roomType = this.roomTypeRepository.create(createRoomTypeDto);
    const saved = await this.roomTypeRepository.save(roomType);

    if (hotelId) {
      const hotel = await this.findById(hotelId);
      hotel.roomTypes = [...hotel.roomTypes, saved];
      await this.hotelRepository.save(hotel);
    }

    return saved;
  }

  async findAllRoomTypes(): Promise<RoomType[]> {
    return this.roomTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findRoomTypeById(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({ where: { id } });
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }
    return roomType;
  }

  async updateRoomType(
    roomTypeId: string,
    updateDto: Partial<CreateRoomTypeDto>,
  ): Promise<RoomType> {
    const roomType = await this.findRoomTypeById(roomTypeId);
    Object.assign(roomType, updateDto);
    return this.roomTypeRepository.save(roomType);
  }

  async removeRoomType(roomTypeId: string): Promise<void> {
    const roomType = await this.findRoomTypeById(roomTypeId);
    await this.roomTypeRepository.remove(roomType);
  }

  async calculateAllocation(
    _hotelId: string,
    roomTypeId: string,
    adults: number,
    nights = 1,
  ): Promise<RoomAllocationResult> {
    const roomType = await this.findRoomTypeById(roomTypeId);
    return calculateRoomAllocation(adults, roomType, nights);
  }
}

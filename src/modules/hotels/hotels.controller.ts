import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { CreateHotelDto } from '@/modules/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from '@/modules/hotels/dto/update-hotel.dto';
import { CreateRoomTypeDto } from '@/modules/hotels/dto/create-room-type.dto';
import {
  HotelsService,
  type RoomAllocationResult,
} from '@/modules/hotels/hotels.service';

@ApiTags('Hotels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('room-types')
  @ApiOperation({ summary: 'Get all independent master room types' })
  async findAllRoomTypes(): Promise<RoomType[]> {
    return this.hotelsService.findAllRoomTypes();
  }

  @Post('room-types')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create independent master room type' })
  async createIndependentRoomType(
    @Body() createRoomTypeDto: CreateRoomTypeDto,
    @Query('hotelId') hotelId?: string,
  ): Promise<RoomType> {
    return this.hotelsService.createRoomType(createRoomTypeDto, hotelId);
  }

  @Patch('room-types/:roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update independent room type' })
  async updateIndependentRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
    @Body() updateDto: Partial<CreateRoomTypeDto>,
  ): Promise<RoomType> {
    return this.hotelsService.updateRoomType(roomTypeId, updateDto);
  }

  @Delete('room-types/:roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete independent room type' })
  async deleteIndependentRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
  ): Promise<{ message: string }> {
    await this.hotelsService.removeRoomType(roomTypeId);
    return { message: 'Room type deleted successfully' };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all hotels (optional filter by destinationId)',
  })
  @ApiQuery({
    name: 'destinationId',
    required: false,
    type: String,
    description: 'Filter hotels by Destination UUID',
  })
  async findAll(
    @Query('destinationId') destinationId?: string,
  ): Promise<Hotel[]> {
    return this.hotelsService.findAll(destinationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel details by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Hotel> {
    return this.hotelsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new hotel' })
  async create(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.hotelsService.create(createHotelDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update hotel details' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<Hotel> {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete hotel' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.hotelsService.remove(id);
    return { message: 'Hotel deleted successfully' };
  }

  @Post(':id/room-types')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add room type to hotel' })
  async createRoomType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createRoomTypeDto: CreateRoomTypeDto,
  ): Promise<RoomType> {
    return this.hotelsService.createRoomType(createRoomTypeDto, id);
  }

  @Patch(':id/room-types/:roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update room type' })
  async updateRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
    @Body() updateDto: Partial<CreateRoomTypeDto>,
  ): Promise<RoomType> {
    return this.hotelsService.updateRoomType(roomTypeId, updateDto);
  }

  @Delete(':id/room-types/:roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete room type' })
  async removeRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
  ): Promise<{ message: string }> {
    await this.hotelsService.removeRoomType(roomTypeId);
    return { message: 'Room type deleted successfully' };
  }

  @Post(':id/calculate-allocation')
  @ApiOperation({ summary: 'Calculate room allocation and price' })
  async calculateAllocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { roomTypeId: string; adults: number; nights?: number },
  ): Promise<RoomAllocationResult> {
    return this.hotelsService.calculateAllocation(
      id,
      body.roomTypeId,
      body.adults,
      body.nights ?? 1,
    );
  }
}

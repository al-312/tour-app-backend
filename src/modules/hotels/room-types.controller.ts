import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { HotelsService } from '@/modules/hotels/hotels.service';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { CreateRoomTypeDto } from '@/modules/hotels/dto/create-room-type.dto';

@ApiTags('Room Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('room-types')
export class RoomTypesController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all master room types' })
  async findAllRoomTypes(): Promise<RoomType[]> {
    return this.hotelsService.findAllRoomTypes();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create master room type' })
  async createIndependentRoomType(
    @Body() createRoomTypeDto: CreateRoomTypeDto,
    @Query('hotelId') hotelId?: string,
  ): Promise<RoomType> {
    return this.hotelsService.createRoomType(createRoomTypeDto, hotelId);
  }

  @Patch(':roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update room type' })
  async updateIndependentRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
    @Body() updateDto: Partial<CreateRoomTypeDto>,
  ): Promise<RoomType> {
    return this.hotelsService.updateRoomType(roomTypeId, updateDto);
  }

  @Delete(':roomTypeId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete room type' })
  async deleteIndependentRoomType(
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
  ): Promise<{ message: string }> {
    await this.hotelsService.removeRoomType(roomTypeId);
    return { message: 'Room type deleted successfully' };
  }
}

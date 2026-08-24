import {
  ApiTags,
  ApiOperation,
  ApiResponse,
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
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { HotelsService } from '@/modules/hotels/hotels.service';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CreateHotelDto } from '@/modules/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from '@/modules/hotels/dto/update-hotel.dto';
import { HotelResponseDto } from '@/modules/hotels/dto/hotel-response.dto';

@ApiTags('Hotels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

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
  @ApiResponse({
    status: 200,
    description: 'Returns list of hotels',
    type: [HotelResponseDto],
  })
  async findAll(
    @Query('destinationId') destinationId?: string,
  ): Promise<HotelResponseDto[]> {
    return this.hotelsService.findAll(destinationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns hotel details',
    type: HotelResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HotelResponseDto> {
    const hotel = await this.hotelsService.findById(id);
    return HotelResponseDto.fromEntity(hotel);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Create new hotel' })
  @ApiResponse({
    status: 201,
    description: 'Hotel created successfully',
    type: HotelResponseDto,
  })
  async create(
    @Body() createHotelDto: CreateHotelDto,
  ): Promise<HotelResponseDto> {
    const hotel = await this.hotelsService.create(createHotelDto);
    return HotelResponseDto.fromEntity(hotel);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Update hotel details' })
  @ApiResponse({
    status: 200,
    description: 'Hotel updated successfully',
    type: HotelResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<HotelResponseDto> {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete hotel' })
  @ApiResponse({
    status: 200,
    description: 'Hotel deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.hotelsService.remove(id);
    return { message: 'Hotel deleted successfully' };
  }
}

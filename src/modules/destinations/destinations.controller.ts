import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { DestinationsService } from '@/modules/destinations/destinations.service';
import { CreateDestinationDto } from '@/modules/destinations/dto/create-destination.dto';
import { UpdateDestinationDto } from '@/modules/destinations/dto/update-destination.dto';
import { DestinationResponseDto } from '@/modules/destinations/dto/destination-response.dto';

@ApiTags('Destinations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all destinations' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all destinations',
    type: [DestinationResponseDto],
  })
  async findAll(): Promise<DestinationResponseDto[]> {
    return this.destinationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get destination by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns destination details',
    type: DestinationResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DestinationResponseDto> {
    const destination = await this.destinationsService.findById(id);
    return DestinationResponseDto.fromEntity(destination);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Create new destination' })
  @ApiResponse({
    status: 201,
    description: 'Destination created successfully',
    type: DestinationResponseDto,
  })
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<DestinationResponseDto> {
    const destination =
      await this.destinationsService.create(createDestinationDto);
    return DestinationResponseDto.fromEntity(destination);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Update destination' })
  @ApiResponse({
    status: 200,
    description: 'Destination updated successfully',
    type: DestinationResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete destination' })
  @ApiResponse({
    status: 200,
    description: 'Destination deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.destinationsService.remove(id);
    return { message: 'Destination deleted successfully' };
  }
}

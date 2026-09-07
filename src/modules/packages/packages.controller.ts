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
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Package } from '@/modules/packages/entities/package.entity';
import { PackagesService } from '@/modules/packages/packages.service';
import { CreatePackageDto } from '@/modules/packages/dto/create-package.dto';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@ApiTags('Tour Packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('search')
  @ApiOperation({
    summary:
      'Consultant search packages by source, destination, and other filters',
  })
  @ApiQuery({ name: 'destinationId', required: false, type: String })
  @ApiQuery({ name: 'destination', required: false, type: String })
  @ApiQuery({ name: 'source', required: false, type: String })
  @ApiQuery({ name: 'travelDate', required: false, type: String })
  @ApiQuery({ name: 'days', required: false, type: String })
  @ApiQuery({ name: 'adults', required: false, type: String })
  @ApiQuery({ name: 'children', required: false, type: String })
  async search(
    @Query('destinationId') destinationId?: string,
    @Query('destination') destination?: string,
    @Query('source') source?: string,
    @Query('travelDate') travelDate?: string,
    @Query('days') days?: string,
    @Query('adults') adults?: string,
    @Query('children') children?: string,
  ): Promise<Package[]> {
    const params: {
      destinationId?: string;
      destination?: string;
      source?: string;
      travelDate?: string;
      days?: number;
      adults?: number;
      children?: number;
    } = {};

    if (destinationId) {
      params.destinationId = destinationId;
    }
    if (destination) {
      params.destination = destination;
    }
    if (source) {
      params.source = source;
    }
    if (travelDate) {
      params.travelDate = travelDate;
    }
    if (days) {
      params.days = parseInt(days, 10);
    }
    if (adults) {
      params.adults = parseInt(adults, 10);
    }
    if (children) {
      params.children = parseInt(children, 10);
    }

    return this.packagesService.search(params);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tour packages' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'source', required: false, type: String })
  @ApiQuery({ name: 'destinationId', required: false, type: String })
  async findAll(
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('destinationId') destinationId?: string,
  ): Promise<Package[]> {
    return this.packagesService.findAll(status, source, destinationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tour package details by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Package> {
    return this.packagesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new tour package (Admin 3-step wizard)' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<Package> {
    return this.packagesService.create(createPackageDto, user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update tour package details' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackageDto: Partial<CreatePackageDto>,
  ): Promise<Package> {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete tour package' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.packagesService.remove(id);
    return { message: 'Tour package deleted successfully' };
  }
}

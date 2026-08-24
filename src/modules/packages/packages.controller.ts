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
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { PackagesService } from '@/modules/packages/packages.service';
import { CreatePackageDto } from '@/modules/packages/dto/create-package.dto';
import { UpdatePackageDto } from '@/modules/packages/dto/update-package.dto';
import { PackageStatus } from '@/modules/packages/enums/package-status.enum';
import { PackageResponseDto } from '@/modules/packages/dto/package-response.dto';

@ApiTags('Tour Packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tour packages (optional filter by status)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PackageStatus,
    description: 'Filter packages by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of tour packages',
    type: [PackageResponseDto],
  })
  async findAll(
    @Query('status') status?: PackageStatus,
  ): Promise<PackageResponseDto[]> {
    return this.packagesService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tour package details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns tour package with itinerary days',
    type: PackageResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PackageResponseDto> {
    return this.packagesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Create new tour package' })
  @ApiResponse({
    status: 201,
    description: 'Tour package created successfully',
    type: PackageResponseDto,
  })
  async create(
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.create(createPackageDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Update tour package details' })
  @ApiResponse({
    status: 200,
    description: 'Tour package updated successfully',
    type: PackageResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete tour package' })
  @ApiResponse({
    status: 200,
    description: 'Tour package deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.packagesService.remove(id);
    return { message: 'Tour package deleted successfully' };
  }
}

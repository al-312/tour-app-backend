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
import { ClientsService } from '@/modules/clients/clients.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CreateClientDto } from '@/modules/clients/dto/create-client.dto';
import { UpdateClientDto } from '@/modules/clients/dto/update-client.dto';
import { ClientResponseDto } from '@/modules/clients/dto/client-response.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all clients',
    type: [ClientResponseDto],
  })
  async findAll(): Promise<ClientResponseDto[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns client profile',
    type: ClientResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClientResponseDto> {
    const client = await this.clientsService.findById(id);
    return ClientResponseDto.fromEntity(client);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientResponseDto,
  })
  async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.clientsService.create(createClientDto);
    return ClientResponseDto.fromEntity(client);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @ApiOperation({ summary: 'Update client details' })
  @ApiResponse({
    status: 200,
    description: 'Client details updated successfully',
    type: ClientResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete client profile' })
  @ApiResponse({
    status: 200,
    description: 'Client deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.clientsService.remove(id);
    return { message: 'Client deleted successfully' };
  }
}

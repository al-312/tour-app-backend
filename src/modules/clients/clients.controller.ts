import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
import { Client } from '@/modules/clients/entities/client.entity';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { ClientsService } from '@/modules/clients/clients.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CreateClientDto } from '@/modules/clients/dto/create-client.dto';
import { UpdateClientDto } from '@/modules/clients/dto/update-client.dto';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  async findAll(@CurrentUser() user: JwtPayload): Promise<Client[]> {
    const consultantId =
      user.role === UserRole.CONSULTANT ? user.sub : undefined;
    return this.clientsService.findAll(consultantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new client' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientsService.create(createClientDto, user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update client details' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete client profile' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.clientsService.remove(id);
    return { message: 'Client deleted successfully' };
  }
}

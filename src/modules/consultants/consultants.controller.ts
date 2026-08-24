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
import { ConsultantsService } from '@/modules/consultants/consultants.service';
import { CreateConsultantDto } from '@/modules/consultants/dto/create-consultant.dto';
import { UpdateConsultantDto } from '@/modules/consultants/dto/update-consultant.dto';
import { ConsultantResponseDto } from '@/modules/consultants/dto/consultant-response.dto';

@ApiTags('Consultants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultants')
export class ConsultantsController {
  constructor(private readonly consultantsService: ConsultantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all consultants' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all consultants',
    type: [ConsultantResponseDto],
  })
  async findAll(): Promise<ConsultantResponseDto[]> {
    return this.consultantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultant details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns consultant profile',
    type: ConsultantResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ConsultantResponseDto> {
    const consultant = await this.consultantsService.findById(id);
    return ConsultantResponseDto.fromEntity(consultant);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new consultant' })
  @ApiResponse({
    status: 201,
    description: 'Consultant created successfully',
    type: ConsultantResponseDto,
  })
  async create(
    @Body() createConsultantDto: CreateConsultantDto,
  ): Promise<ConsultantResponseDto> {
    const consultant =
      await this.consultantsService.create(createConsultantDto);
    return ConsultantResponseDto.fromEntity(consultant);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update consultant details' })
  @ApiResponse({
    status: 200,
    description: 'Consultant updated successfully',
    type: ConsultantResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConsultantDto: UpdateConsultantDto,
  ): Promise<ConsultantResponseDto> {
    return this.consultantsService.update(id, updateConsultantDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete consultant' })
  @ApiResponse({
    status: 200,
    description: 'Consultant deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.consultantsService.remove(id);
    return { message: 'Consultant deleted successfully' };
  }
}

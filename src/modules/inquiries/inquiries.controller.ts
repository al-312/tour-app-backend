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
  UseGuards,
  ParseUUIDPipe,
  Header,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';
import { InquiriesService } from '@/modules/inquiries/inquiries.service';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { CreateInquiryDto } from '@/modules/inquiries/dto/create-inquiry.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UpdateInquiryStatusDto } from '@/modules/inquiries/dto/update-inquiry-status.dto';

@ApiTags('Inquiries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Submit a new inquiry' })
  @ApiResponse({
    status: 201,
    description: 'Inquiry submitted successfully',
    type: Inquiry,
  })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateInquiryDto,
  ): Promise<Inquiry> {
    return this.inquiriesService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inquiries for user role' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of inquiries',
    type: [Inquiry],
  })
  async findAll(@CurrentUser() user: JwtPayload): Promise<Inquiry[]> {
    return this.inquiriesService.findAll({ id: user.sub, role: user.role });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns inquiry details',
    type: Inquiry,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Inquiry> {
    return this.inquiriesService.findOne(id, { id: user.sub, role: user.role });
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update inquiry status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Inquiry status updated successfully',
    type: Inquiry,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateInquiryStatusDto,
  ): Promise<Inquiry> {
    return this.inquiriesService.updateStatus(
      id,
      { id: user.sub, role: user.role },
      dto,
    );
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({ summary: 'Download PDF voucher for approved inquiry' })
  async getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<string> {
    return this.inquiriesService.generatePdfHtml(id, {
      id: user.sub,
      role: user.role,
    });
  }
}

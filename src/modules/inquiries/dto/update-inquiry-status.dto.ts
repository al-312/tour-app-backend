import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { InquiryStatus } from '@/modules/inquiries/entities/inquiry.entity';

export class UpdateInquiryStatusDto {
  @ApiProperty({ enum: InquiryStatus, example: InquiryStatus.APPROVED })
  @IsEnum(InquiryStatus)
  status!: InquiryStatus;

  @ApiPropertyOptional({ example: 1250.0 })
  @IsNumber()
  @IsOptional()
  approvedTotal?: number;

  @ApiPropertyOptional({ example: 'All hotel vouchers confirmed with resort.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

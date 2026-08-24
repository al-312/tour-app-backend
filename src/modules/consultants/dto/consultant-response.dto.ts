import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Consultant } from '@/modules/consultants/entities/consultant.entity';

export class ConsultantResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 'Sarah Jenkins' })
  name!: string;

  @ApiProperty({ example: 'Senior Travel Specialist' })
  designation!: string;

  @ApiPropertyOptional({ example: '+15559876543' })
  phone?: string | undefined;

  @ApiPropertyOptional({ example: 'sarah.j@auratours.com' })
  email?: string | undefined;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  logo?: string | undefined;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(consultant: Consultant): ConsultantResponseDto {
    const dto = new ConsultantResponseDto();
    dto.id = consultant.id;
    dto.name = consultant.name;
    dto.designation = consultant.designation;
    dto.phone = consultant.phone ?? undefined;
    dto.email = consultant.email ?? undefined;
    dto.logo = consultant.logo ?? undefined;
    dto.createdAt = consultant.createdAt;
    dto.updatedAt = consultant.updatedAt;
    return dto;
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  Consultant,
  PhoneObject,
} from '@/modules/consultants/entities/consultant.entity';

export class ConsultantResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 'Sarah' })
  firstName!: string;

  @ApiPropertyOptional({ example: 'Jenkins' })
  lastName?: string | undefined;

  @ApiProperty({ example: 'Sarah Jenkins' })
  name!: string;

  @ApiProperty({ example: 'Senior Travel Specialist' })
  designation!: string;

  @ApiPropertyOptional({
    example: { countryCode: '+1', number: '5559876543' },
  })
  phone?: PhoneObject | undefined;

  @ApiPropertyOptional({ example: 'sarah.j@auratours.com' })
  email?: string | undefined;

  @ApiPropertyOptional({ example: 'Temp123456!' })
  temporaryPassword?: string | undefined;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(
    consultant: Consultant & { temporaryPassword?: string },
  ): ConsultantResponseDto {
    const dto = new ConsultantResponseDto();
    dto.id = consultant.id;
    dto.firstName = consultant.firstName;
    dto.lastName = consultant.lastName ?? undefined;
    dto.name =
      consultant.name ||
      [consultant.firstName, consultant.lastName].filter(Boolean).join(' ');
    dto.designation = consultant.designation;
    dto.phone = consultant.phone ?? undefined;
    dto.email = consultant.email ?? undefined;
    dto.temporaryPassword = consultant.temporaryPassword;
    dto.createdAt = consultant.createdAt;
    dto.updatedAt = consultant.updatedAt;
    return dto;
  }
}

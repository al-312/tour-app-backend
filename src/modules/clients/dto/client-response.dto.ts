import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Client } from '@/modules/clients/entities/client.entity';

export class ClientResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 'Alice Smith' })
  name!: string;

  @ApiPropertyOptional({ example: '+15551234567' })
  phone?: string | undefined;

  @ApiPropertyOptional({ example: 'alice.smith@example.com' })
  email?: string | undefined;

  @ApiPropertyOptional({ example: 'United States' })
  country?: string | undefined;

  @ApiPropertyOptional({ example: 'Prefers vegetarian meals' })
  notes?: string | undefined;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(client: Client): ClientResponseDto {
    const dto = new ClientResponseDto();
    dto.id = client.id;
    dto.name = client.name;
    dto.phone = client.phone ?? undefined;
    dto.email = client.email ?? undefined;
    dto.country = client.country ?? undefined;
    dto.notes = client.notes ?? undefined;
    dto.createdAt = client.createdAt;
    dto.updatedAt = client.updatedAt;
    return dto;
  }
}

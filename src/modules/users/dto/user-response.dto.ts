import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { User } from '@/modules/users/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  role!: UserRole;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: false })
  mustChangePassword!: boolean;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z', nullable: true })
  passwordChangedAt!: Date | null;

  @ApiProperty({ example: '+1234567890', nullable: true })
  phone?: string | null;

  @ApiProperty({ example: 'Acme Travels', nullable: true })
  companyName?: string | null;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
      passwordChangedAt: user.passwordChangedAt ?? null,
      phone: user.phone ?? null,
      companyName: user.companyName ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

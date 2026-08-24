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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

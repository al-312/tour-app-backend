import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { UserRole } from '@/modules/roles/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: UserRole,
    description: 'New role assigned to the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

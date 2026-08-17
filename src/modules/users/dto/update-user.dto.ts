import { PartialType, OmitType } from '@nestjs/swagger';

import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}

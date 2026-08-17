import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RolesService, RoleInfo } from '@/modules/roles/roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of system roles and descriptions' })
  @ApiResponse({
    status: 200,
    description: 'List of all system roles',
  })
  getRoles(): RoleInfo[] {
    return this.rolesService.getAllRoles();
  }
}

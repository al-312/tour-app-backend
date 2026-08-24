import { Injectable } from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';

export interface RoleInfo {
  name: UserRole;
  description: string;
}

@Injectable()
export class RolesService {
  private readonly rolesInfo: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Full system access and administrative controls',
    [UserRole.CONSULTANT]:
      'Access to create, manage, and assign tour packages and clients',
    [UserRole.CLIENT]: 'Access to view assigned tour packages and itineraries',
  };

  getAllRoles(): RoleInfo[] {
    return Object.values(UserRole).map((role) => ({
      name: role,
      description: this.rolesInfo[role] || '',
    }));
  }

  isValidRole(role: string): boolean {
    return Object.values(UserRole).includes(role as UserRole);
  }
}

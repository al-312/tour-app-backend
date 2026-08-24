import type { UserRole } from '@/modules/roles/enums/role.enum';

export class JwtPayload {
  sub!: string;
  email!: string;
  role!: UserRole;
  iat?: number;
  exp?: number;
}

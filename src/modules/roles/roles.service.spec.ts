import { Test, type TestingModule } from '@nestjs/testing';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { RolesService } from '@/modules/roles/roles.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all roles', () => {
    const roles = service.getAllRoles();
    expect(roles).toHaveLength(4);
    expect(roles.map((r) => r.name)).toContain(UserRole.SUPER_ADMIN);
    expect(roles.map((r) => r.name)).toContain(UserRole.ADMIN);
    expect(roles.map((r) => r.name)).toContain(UserRole.CONSULTANT);
    expect(roles.map((r) => r.name)).toContain(UserRole.CLIENT);
  });

  it('should validate role strings correctly', () => {
    expect(service.isValidRole('SUPER_ADMIN')).toBe(true);
    expect(service.isValidRole('ADMIN')).toBe(true);
    expect(service.isValidRole('CONSULTANT')).toBe(true);
    expect(service.isValidRole('CLIENT')).toBe(true);
    expect(service.isValidRole('INVALID_ROLE')).toBe(false);
  });
});

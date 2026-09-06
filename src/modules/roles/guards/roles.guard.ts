import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { ROLES_KEY } from '@/modules/roles/decorators/roles.decorator';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('User identity or role not found');
    }

    const hasRole =
      requiredRoles.includes(user.role) ||
      (user.role === UserRole.SUPER_ADMIN &&
        requiredRoles.includes(UserRole.ADMIN));
    if (!hasRole) {
      throw new ForbiddenException(
        `User does not have required permissions (${requiredRoles.join(', ')})`,
      );
    }

    return true;
  }
}

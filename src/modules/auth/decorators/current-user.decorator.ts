import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';
import type { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

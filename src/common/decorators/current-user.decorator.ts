import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRefreshPayload } from '../../modules/auth/types/index.js';
import { Request } from 'express';

/**
 * @description This decorator is used to get the current user from the request
 * @param data - The key of the user object to get
 * @Important Make sure to use UseGuards(RefreshTokenGuard) before accessing refresh token
 * @returns The current user
 */
export const CurrentUser = createParamDecorator(
  (data: keyof IRefreshPayload | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as IRefreshPayload | undefined;
    if (!data) return user;
    if (user) {
      return user[data];
    }
    return null;
  },
);

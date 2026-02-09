import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_STRATEGY } from '../strategies/index.js';
import { IS_PUBLIC_KEY } from '../../../common/decorators/index.js';

/**
 * Access token guard
 * - This guard is used to protect the routes that require authentication
 * - This checks for the presence of an access token in the request header
 * - This can be bypassed using the PublicRoute decorator
 */

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }
}

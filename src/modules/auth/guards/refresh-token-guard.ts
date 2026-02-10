import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY } from '../strategies/index.js';

/**
 * Refresh token guard
 * - This guard is used to get the refresh token from the cookie
 * - before use this, bypass the global AccessTokenGuard by using PublicRoute decorator
 */

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {
  constructor() {
    super();
  }
}

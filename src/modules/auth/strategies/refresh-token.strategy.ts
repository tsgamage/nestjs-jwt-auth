import { Request } from 'express';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { authEnvConfig } from '../config/index.js';
import { IPayload, IRefreshPayload } from '../types/index.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constraints/index.js';
import { type ConfigType } from '@nestjs/config';

export const REFRESH_TOKEN_STRATEGY = 'refresh-token-strategy';

/**
 * Refresh token strategy
 * - This strategy is used to get the refresh token from the cookie and validate it
 * - This attaches payload to the request object as `user`
 * - This is used by the RefreshTokenGuard
 * - example payload: { sub: "", email: "", refreshToken: "" }
 */

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY,
) {
  constructor(
    @Inject(authEnvConfig.KEY)
    private readonly envConfig: ConfigType<typeof authEnvConfig>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
        }
        return null;
      },
      secretOrKey: envConfig.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IPayload): IRefreshPayload {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
    if (!refreshToken) throw new UnauthorizedException();
    return { ...payload, refreshToken };
  }
}

import { Request } from 'express';
import { type ConfigType } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authEnvConfig } from '../config/index.js';
import { IPayload, IRefreshPayload } from '../types/index.js';

export const REFRESH_TOKEN_STRATEGY = 'refresh-token-strategy';

/**
 * Refresh token strategy
 * - This strategy is used to validate the refresh token
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IPayload): IRefreshPayload {
    const refreshToken = req.get('authorization')?.replace('Bearer ', '');
    if (!refreshToken) throw new UnauthorizedException();
    return {
      ...payload,
      refreshToken,
    };
  }
}

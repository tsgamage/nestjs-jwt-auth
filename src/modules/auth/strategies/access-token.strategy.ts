import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authEnvConfig } from '../config/index.js';
import { IPayload } from '../types/index.js';

export const ACCESS_TOKEN_STRATEGY = 'access-token-strategy';

/**
 * Access token strategy
 * - This strategy is used to validate the access token
 * - This attaches payload to the request object as `user`
 * - This is used by the AccessTokenGuard
 * - example payload: { sub: "", email: "" }
 */

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY,
) {
  constructor(
    @Inject(authEnvConfig.KEY)
    private readonly envConfig: ConfigType<typeof authEnvConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.accessTokenSecret,
    });
  }

  validate(payload: IPayload) {
    return payload;
  }
}

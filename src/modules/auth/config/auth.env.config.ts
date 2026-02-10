import { registerAs } from '@nestjs/config';

/**
 * @description This config object is used to load the auth level environment variables
 */
export const authEnvConfig = registerAs('auth', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  accessTokenExpiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!),
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  refreshTokenExpiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!),
  cookieRefreshTokenMaxAge: Number(process.env.COOKIE_REFRESH_TOKEN_MAX_AGE!),
}));

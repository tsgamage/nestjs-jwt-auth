import { registerAs } from '@nestjs/config';

/**
 * @description This config object is used to load the app level environment variables
 */
export const appEnvConfig = registerAs('app', () => ({
  port: Number(process.env.PORT) || 3000,
}));

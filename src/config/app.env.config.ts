import { registerAs } from '@nestjs/config';

type TNodeEnv = 'development' | 'production' | 'test';

/**
 * @description This config object is used to load the app level environment variables
 */
export const appEnvConfig = registerAs('app', () => ({
  port: Number(process.env.PORT) || 3000,
  nodeEnv: (process.env.NODE_ENV as TNodeEnv) || 'development',
}));

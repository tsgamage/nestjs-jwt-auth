import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { PrismaService } from './modules/prisma/prisma.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './validators/env.validation.js';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guards/access-token-guard.js';
import { appEnvConfig } from './config/app.env.config.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      /** validationSchema is used to validate the environment variables */
      validationSchema: envValidation,
      /** load is used to load the registered config objects */
      load: [appEnvConfig],
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    /**
     * This makes the AccessTokenGuard the default guard for the application
     * It will be used to protect the routes that require authentication
     */
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}

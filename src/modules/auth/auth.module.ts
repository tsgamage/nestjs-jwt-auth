import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { authEnvConfig } from './config/index.js';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategies/index.js';

@Module({
  imports: [JwtModule.register({}), ConfigModule.forFeature(authEnvConfig)],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}

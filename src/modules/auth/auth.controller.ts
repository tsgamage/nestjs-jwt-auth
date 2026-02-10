import { REFRESH_TOKEN_COOKIE_NAME } from './constraints/index.js';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { CookieOptions, type Response } from 'express';
import {
  Cookies,
  CurrentUser,
  PublicRoute,
} from '../../common/decorators/index.js';
import { RefreshTokenGuard } from './guards/index.js';
import { AuthDto, SignUpDto } from './dtos/index.js';
import { authEnvConfig } from './config/index.js';
import { appEnvConfig } from '../../config/index.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(authEnvConfig.KEY)
    private readonly authEnv: ConfigType<typeof authEnvConfig>,
    @Inject(appEnvConfig.KEY)
    private readonly appEnv: ConfigType<typeof appEnvConfig>,
  ) {}

  private get refreshCookieConfig(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.appEnv.nodeEnv === 'production',
      maxAge: this.authEnv.cookieRefreshTokenMaxAge,
    };
  }

  @PublicRoute()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async localSignIn(
    @Res({ passthrough: true }) res: Response,
    @Body() authDto: AuthDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.localSignIn(authDto);

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      this.refreshCookieConfig,
    );

    return { accessToken };
  }

  @PublicRoute()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async localSignUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.localSignUp(signUpDto);

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      this.refreshCookieConfig,
    );

    return { accessToken };
  }

  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('sub') userId: string,
    @Cookies(REFRESH_TOKEN_COOKIE_NAME) oldRefreshToken: string,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      userId,
      oldRefreshToken,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      this.refreshCookieConfig,
    );

    return { accessToken };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('sub') userId: string,
  ) {
    await this.authService.signOut(userId);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return { success: true };
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  status(@CurrentUser('sub') userId: string) {
    return this.authService.status(userId);
  }
}

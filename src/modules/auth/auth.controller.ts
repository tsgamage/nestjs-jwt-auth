import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RefreshTokenGuard } from './guards/index.js';
import { CurrentUser, PublicRoute } from '../../common/decorators/index.js';
import { AuthDto, SignUpDto } from './dtos/index.js';
import { type IRefreshPayload } from './types/index.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  localSignIn(@Body() authDto: AuthDto) {
    return this.authService.localSignIn(authDto);
  }

  @PublicRoute()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  localSignUp(@Body() signUpDto: SignUpDto) {
    return this.authService.localSignUp(signUpDto);
  }

  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUser() user: IRefreshPayload) {
    return this.authService.refreshToken(user.sub, user.refreshToken);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@CurrentUser('sub') userId: string) {
    await this.authService.signOut(userId);
    return { success: true, message: 'User signed out successfully' };
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }

  @Get('status')
  status(@CurrentUser('sub') userId: string) {
    return this.authService.status(userId);
  }
}

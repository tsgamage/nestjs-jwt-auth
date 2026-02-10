import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import { AuthDto, SignUpDto } from './dtos/index.js';
import { IPayload, ITokens } from './types/index.js';
import { authEnvConfig } from './config/index.js';
import {
  authUserResponseSelect,
  IAuthUserResponse,
  IAuthStatusResponse,
} from './types/response.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,

    @Inject(authEnvConfig.KEY)
    private readonly authEnv: ConfigType<typeof authEnvConfig>,
  ) {}

  async localSignIn(authDto: AuthDto): Promise<ITokens> {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const passwordMatches = await argon.verify(user.password, authDto.password);
    if (!passwordMatches) throw new BadRequestException('Invalid credentials');

    if (user.deletedAt) throw new BadRequestException('Account deleted');

    const { accessToken, refreshToken } = await this.generateTokens({
      sub: user.id,
      email: user.email,
    });
    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async localSignUp(signUpDto: SignUpDto): Promise<ITokens> {
    const isUserExist = await this.prismaService.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (isUserExist) throw new ConflictException('Credentials taken');

    const hashedPassword = await this.hashData(signUpDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens({
      sub: newUser.id,
      email: newUser.email,
    });

    await this.updateRefreshToken(newUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signOut(userId: string) {
    await this.prismaService.user.updateMany({
      where: { AND: [{ id: userId }, { refreshToken: { not: null } }] },
      data: { refreshToken: null },
    });
  }

  async refreshToken(userId: string, refreshToken: string): Promise<ITokens> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Account not found');
    if (!user.refreshToken) throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens({
        sub: user.id,
        email: user.email,
      });
    await this.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async me(userId: string): Promise<IAuthUserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, deletedAt: null, refreshToken: { not: null } },
      select: authUserResponseSelect,
    });

    if (!user) throw new ForbiddenException('Access denied');
    return user;
  }

  async status(userId: string): Promise<IAuthStatusResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, deletedAt: null, refreshToken: { not: null } },
      select: { id: true },
    });

    if (!user) return { ok: false };

    return { ok: true };
  }

  async hashData(data: string) {
    return await argon.hash(data);
  }

  async generateTokens(payload: IPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
        {
          expiresIn: this.authEnv.accessTokenExpiresIn,
          secret: this.authEnv.accessTokenSecret,
        },
      ),
      this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
        {
          expiresIn: this.authEnv.refreshTokenExpiresIn,
          secret: this.authEnv.refreshTokenSecret,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}

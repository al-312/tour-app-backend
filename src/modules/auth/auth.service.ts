import * as argon2 from 'argon2';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { LoginDto } from '@/modules/auth/dto/login.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { AppConfigService } from '@/core/config/app-config.service';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { AuthResponseDto } from '@/modules/auth/dto/auth-response.dto';
import { UserResponseDto } from '@/modules/users/dto/user-response.dto';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      ...(registerDto.role !== undefined ? { role: registerDto.role } : {}),
    });

    const tokens = await this.generateTokens(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: UserResponseDto.fromEntity(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: UserResponseDto.fromEntity(user),
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.jwtRefreshSecret,
        },
      );

      const user = await this.usersService.findById(payload.sub);

      return await this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return UserResponseDto.fromEntity(user);
  }

  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessOptions: JwtSignOptions = {
      secret: this.configService.jwtAccessSecret,
      expiresIn: this.configService.jwtAccessExpiration as unknown as number,
    };

    const refreshOptions: JwtSignOptions = {
      secret: this.configService.jwtRefreshSecret,
      expiresIn: this.configService.jwtRefreshExpiration as unknown as number,
    };

    const accessToken = await this.jwtService.signAsync(
      payload as unknown as Record<string, unknown>,
      accessOptions,
    );

    const refreshToken = await this.jwtService.signAsync(
      payload as unknown as Record<string, unknown>,
      refreshOptions,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

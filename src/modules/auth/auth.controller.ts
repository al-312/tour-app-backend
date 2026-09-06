import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { AuthResponseDto } from '@/modules/auth/dto/auth-response.dto';
import { UserResponseDto } from '@/modules/users/dto/user-response.dto';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with credentials' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns tokens and user info',
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user profile',
    type: UserResponseDto,
  })
  async getMe(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserResponseDto> {
    return this.authService.getProfile(currentUser.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: AuthResponseDto,
  })
  async changePassword(
    @CurrentUser() currentUser: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<AuthResponseDto> {
    return this.authService.changePassword(currentUser.sub, changePasswordDto);
  }
}

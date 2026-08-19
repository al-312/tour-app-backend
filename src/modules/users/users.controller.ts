import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { UsersService } from '@/modules/users/users.service';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UserResponseDto } from '@/modules/users/dto/user-response.dto';
import { UpdateUserRoleDto } from '@/modules/users/dto/update-user-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all users',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: UserResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserResponseDto,
  })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateRole(id, updateUserRoleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}

import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, type TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import type { CreateUserDto } from '@/modules/users/dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 'user-uuid-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: UserRole.CLIENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn((dto: CreateUserDto) => dto),
    save: jest
      .fn()
      .mockImplementation((user: Partial<User>) =>
        Promise.resolve({ id: 'user-uuid-1', ...user } as User),
      ),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toHaveProperty('id');
      expect(result.email).toBe('john@example.com');
    });

    it('should throw ConflictException if email exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const user = await service.findById('user-uuid-1');
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findById('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

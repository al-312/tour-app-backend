import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, type TestingModule } from '@nestjs/testing';

import { Package } from '@/modules/packages/entities/package.entity';
import { PackagesService } from '@/modules/packages/packages.service';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';

describe('PackagesService', () => {
  let service: PackagesService;

  const mockDestination: Destination = {
    id: 'dest-uuid-1',
    name: 'Dubai',
    country: 'UAE',
    city: 'Dubai',
    status: 'ACTIVE',
    hotels: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPackage: Package = {
    id: 'pkg-uuid-1',
    packageName: '5-Day Dubai Luxury Escape',
    source: 'Bangalore',
    destinationId: 'dest-uuid-1',
    destination: mockDestination,
    clientId: null,
    client: null,
    durationDays: 5,
    adults: 2,
    children: 0,
    fromDatetimeUtc: new Date('2026-10-01'),
    toDatetimeUtc: new Date('2026-10-06'),
    summary: 'Luxury escape',
    startingPrice: 1200,
    status: 'ACTIVE',
    createdBy: 'user-uuid-admin',
    packageDays: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockPackage]),
  };

  const mockPackageRepo = {
    create: jest.fn((dto: Partial<Package>) => ({ ...dto })),
    save: jest
      .fn()
      .mockImplementation((pkg: Partial<Package>) =>
        Promise.resolve({ id: 'pkg-uuid-1', ...pkg } as Package),
      ),
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([mockPackage]),
    remove: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockPackageDayRepo = {
    create: jest.fn((dto: Partial<PackageDay>) => ({ ...dto })),
    save: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockDestinationRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: getRepositoryToken(Package),
          useValue: mockPackageRepo,
        },
        {
          provide: getRepositoryToken(PackageDay),
          useValue: mockPackageDayRepo,
        },
        {
          provide: getRepositoryToken(Destination),
          useValue: mockDestinationRepo,
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a package with source and destination successfully', async () => {
      mockDestinationRepo.findOne.mockResolvedValue(mockDestination);
      mockPackageRepo.findOne.mockResolvedValue(mockPackage);

      const dto = {
        packageName: '5-Day Dubai Luxury Escape',
        source: 'Bangalore',
        destinationId: 'dest-uuid-1',
        durationDays: 5,
        fromDatetimeUtc: '2026-10-01T00:00:00Z',
        toDatetimeUtc: '2026-10-06T00:00:00Z',
      };

      const result = await service.create(dto, 'admin-id');

      expect(mockDestinationRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'dest-uuid-1' },
      });
      expect(mockPackageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          packageName: '5-Day Dubai Luxury Escape',
          source: 'Bangalore',
          destinationId: 'dest-uuid-1',
        }),
      );
      expect(result).toEqual(mockPackage);
    });

    it('should throw NotFoundException if destination does not exist', async () => {
      mockDestinationRepo.findOne.mockResolvedValue(null);

      const dto = {
        packageName: 'Invalid Package',
        source: 'Bangalore',
        destinationId: 'non-existent-dest',
        durationDays: 5,
        fromDatetimeUtc: '2026-10-01T00:00:00Z',
        toDatetimeUtc: '2026-10-06T00:00:00Z',
      };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search (Consultant filtering)', () => {
    it('should filter packages by source and destination for consultant side', async () => {
      mockPackageRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.search({
        source: 'Bangalore',
        destinationId: 'dest-uuid-1',
      });

      expect(mockPackageRepo.createQueryBuilder).toHaveBeenCalledWith('pkg');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'pkg.destinationId = :destinationId',
        { destinationId: 'dest-uuid-1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(pkg.source) LIKE LOWER(:source)',
        { source: '%Bangalore%' },
      );
      expect(result).toEqual([mockPackage]);
    });

    it('should filter packages by destination name string search when destinationId is not given', async () => {
      mockPackageRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.search({
        destination: 'Dubai',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(pkg.destinationId = :destId OR LOWER(destination.name) LIKE LOWER(:destName) OR LOWER(destination.city) LIKE LOWER(:destName) OR LOWER(destination.country) LIKE LOWER(:destName))',
        { destId: 'Dubai', destName: '%Dubai%' },
      );
    });
  });
});

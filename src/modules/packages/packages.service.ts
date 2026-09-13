import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Package } from '@/modules/packages/entities/package.entity';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { CreatePackageDto } from '@/modules/packages/dto/create-package.dto';
import { mapCreateDayInputsToEntities } from '@/modules/packages/utils/package-mapper.util';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageDay)
    private readonly packageDayRepository: Repository<PackageDay>,
  ) {}

  async create(
    createPackageDto: CreatePackageDto,
    createdBy?: string,
  ): Promise<Package> {
    const pkg = this.packageRepository.create({
      packageName: createPackageDto.packageName,
      clientId: createPackageDto.clientId ?? null,
      durationDays: createPackageDto.durationDays,
      adults: createPackageDto.adults ?? 2,
      children: createPackageDto.children ?? 0,
      fromDatetimeUtc: new Date(createPackageDto.fromDatetimeUtc),
      toDatetimeUtc: new Date(createPackageDto.toDatetimeUtc),
      summary: createPackageDto.summary ?? '',
      startingPrice: createPackageDto.startingPrice ?? 0,
      status: createPackageDto.status ?? 'ACTIVE',
      createdBy: createdBy ?? null,
    });

    if (
      createPackageDto.packageDays &&
      createPackageDto.packageDays.length > 0
    ) {
      pkg.packageDays = mapCreateDayInputsToEntities(
        createPackageDto.packageDays,
      );
    }

    const saved = await this.packageRepository.save(pkg);
    return this.findById(saved.id);
  }

  async findAll(status?: string, destinationId?: string): Promise<Package[]> {
    const qb = this.packageRepository
      .createQueryBuilder('pkg')
      .leftJoinAndSelect('pkg.client', 'client')
      .leftJoinAndSelect('pkg.packageDays', 'packageDays')
      .leftJoinAndSelect('packageDays.destination', 'dayDestination')
      .leftJoinAndSelect('packageDays.hotel', 'hotel')
      .leftJoinAndSelect('hotel.roomTypes', 'roomTypes');

    if (status) {
      qb.andWhere('pkg.status = :status', { status });
    }

    if (destinationId) {
      qb.andWhere('dayDestination.id = :destinationId', { destinationId });
    }

    qb.orderBy('pkg.createdAt', 'DESC');
    return qb.getMany();
  }

  async search(params: {
    destinationId?: string;
    destination?: string;
    travelDate?: string;
    days?: number;
    adults?: number;
    children?: number;
  }): Promise<Package[]> {
    const qb = this.packageRepository
      .createQueryBuilder('pkg')
      .leftJoinAndSelect('pkg.client', 'client')
      .leftJoinAndSelect('pkg.packageDays', 'packageDays')
      .leftJoinAndSelect('packageDays.destination', 'dayDestination')
      .leftJoinAndSelect('packageDays.hotel', 'hotel')
      .leftJoinAndSelect('hotel.roomTypes', 'roomTypes')
      .where("pkg.status NOT IN ('EXPIRED', 'CANCELLED')")
      .andWhere('(pkg.toDatetimeUtc IS NULL OR pkg.toDatetimeUtc >= :now)', {
        now: new Date(),
      });

    if (params.destinationId) {
      qb.andWhere('dayDestination.id = :destinationId', {
        destinationId: params.destinationId,
      });
    } else if (params.destination) {
      qb.andWhere(
        '(dayDestination.id = :destId OR LOWER(dayDestination.name) LIKE LOWER(:destName) OR LOWER(dayDestination.city) LIKE LOWER(:destName) OR LOWER(dayDestination.country) LIKE LOWER(:destName))',
        {
          destId: params.destination,
          destName: `%${params.destination}%`,
        },
      );
    }

    if (params.travelDate) {
      const travelDate = new Date(params.travelDate);
      if (!isNaN(travelDate.getTime())) {
        qb.andWhere(
          '(pkg.fromDatetimeUtc IS NULL OR pkg.fromDatetimeUtc <= :travelDate) AND (pkg.toDatetimeUtc IS NULL OR pkg.toDatetimeUtc >= :travelDate)',
          { travelDate },
        );
      }
    }

    if (params.days) {
      qb.andWhere('pkg.durationDays = :days', { days: params.days });
    }

    if (params.adults) {
      qb.andWhere('pkg.adults >= :adults', { adults: params.adults });
    }

    if (params.children) {
      qb.andWhere('pkg.children >= :children', { children: params.children });
    }

    qb.orderBy('pkg.createdAt', 'DESC');
    return qb.getMany();
  }

  async findById(id: string): Promise<Package> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: {
        client: true,
        packageDays: {
          destination: true,
          hotel: {
            roomTypes: true,
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return pkg;
  }

  async update(
    id: string,
    updatePackageDto: Partial<CreatePackageDto>,
  ): Promise<Package> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: { packageDays: true },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    if (updatePackageDto.packageName !== undefined) {
      pkg.packageName = updatePackageDto.packageName;
    }
    if (updatePackageDto.clientId !== undefined) {
      pkg.clientId = updatePackageDto.clientId;
    }
    if (updatePackageDto.durationDays !== undefined) {
      pkg.durationDays = updatePackageDto.durationDays;
    }
    if (updatePackageDto.adults !== undefined) {
      pkg.adults = updatePackageDto.adults;
    }
    if (updatePackageDto.children !== undefined) {
      pkg.children = updatePackageDto.children;
    }
    if (updatePackageDto.summary !== undefined) {
      pkg.summary = updatePackageDto.summary;
    }
    if (updatePackageDto.startingPrice !== undefined) {
      pkg.startingPrice = updatePackageDto.startingPrice;
    }
    if (updatePackageDto.status !== undefined) {
      pkg.status = updatePackageDto.status;
    }
    if (updatePackageDto.fromDatetimeUtc !== undefined) {
      pkg.fromDatetimeUtc = updatePackageDto.fromDatetimeUtc
        ? new Date(updatePackageDto.fromDatetimeUtc)
        : null;
    }
    if (updatePackageDto.toDatetimeUtc !== undefined) {
      pkg.toDatetimeUtc = updatePackageDto.toDatetimeUtc
        ? new Date(updatePackageDto.toDatetimeUtc)
        : null;
    }

    if (updatePackageDto.packageDays !== undefined) {
      if (pkg.packageDays.length > 0) {
        await this.packageDayRepository.remove(pkg.packageDays);
      }
      pkg.packageDays = mapCreateDayInputsToEntities(
        updatePackageDto.packageDays,
      );
    }

    await this.packageRepository.save(pkg);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const pkg = await this.packageRepository.findOne({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    await this.packageRepository.remove(pkg);
  }
}

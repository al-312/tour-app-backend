import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { CreatePackageDto } from '@/modules/packages/dto/create-package.dto';
import { UpdatePackageDto } from '@/modules/packages/dto/update-package.dto';
import { PackageStatus } from '@/modules/packages/enums/package-status.enum';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';
import { PackageResponseDto } from '@/modules/packages/dto/package-response.dto';
import { mapCreateDayInputsToEntities } from '@/modules/packages/utils/package-mapper.util';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageDay)
    private readonly packageDayRepository: Repository<PackageDay>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,
  ) {}

  async create(
    createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    if (createPackageDto.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: createPackageDto.clientId },
      });
      if (!client) {
        throw new NotFoundException(
          `Client with ID ${createPackageDto.clientId} not found`,
        );
      }
    }

    if (createPackageDto.destinationId) {
      const destination = await this.destinationRepository.findOne({
        where: { id: createPackageDto.destinationId },
      });
      if (!destination) {
        throw new NotFoundException(
          `Destination with ID ${createPackageDto.destinationId} not found`,
        );
      }
    }

    if (createPackageDto.consultantId) {
      const consultant = await this.consultantRepository.findOne({
        where: { id: createPackageDto.consultantId },
      });
      if (!consultant) {
        throw new NotFoundException(
          `Consultant with ID ${createPackageDto.consultantId} not found`,
        );
      }
    }

    const pkg = this.packageRepository.create({
      packageName: createPackageDto.packageName,
      clientId: createPackageDto.clientId ?? null,
      destinationId: createPackageDto.destinationId ?? null,
      consultantId: createPackageDto.consultantId ?? null,
      startDate: createPackageDto.startDate
        ? new Date(createPackageDto.startDate)
        : null,
      numberOfDays: createPackageDto.numberOfDays,
      adults: createPackageDto.adults,
      children: createPackageDto.children ?? 0,
      status: createPackageDto.status ?? PackageStatus.CONFIRMED,
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

  private readonly defaultRelations = {
    client: true,
    destination: true,
    consultant: true,
    packageDays: {
      hotel: true,
    },
  };

  async findAll(status?: PackageStatus): Promise<PackageResponseDto[]> {
    const whereCondition = status ? { status } : {};
    const packages = await this.packageRepository.find({
      where: whereCondition,
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });

    return packages.map((p) => PackageResponseDto.fromEntity(p));
  }

  async findById(id: string): Promise<PackageResponseDto> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: this.defaultRelations,
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return PackageResponseDto.fromEntity(pkg);
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageResponseDto> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: { packageDays: true },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    if (updatePackageDto.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: updatePackageDto.clientId },
      });
      if (!client) {
        throw new NotFoundException(
          `Client with ID ${updatePackageDto.clientId} not found`,
        );
      }
    }

    if (updatePackageDto.destinationId) {
      const destination = await this.destinationRepository.findOne({
        where: { id: updatePackageDto.destinationId },
      });
      if (!destination) {
        throw new NotFoundException(
          `Destination with ID ${updatePackageDto.destinationId} not found`,
        );
      }
    }

    if (updatePackageDto.consultantId) {
      const consultant = await this.consultantRepository.findOne({
        where: { id: updatePackageDto.consultantId },
      });
      if (!consultant) {
        throw new NotFoundException(
          `Consultant with ID ${updatePackageDto.consultantId} not found`,
        );
      }
    }

    if (updatePackageDto.packageName !== undefined) {
      pkg.packageName = updatePackageDto.packageName;
    }
    if (updatePackageDto.clientId !== undefined) {
      pkg.clientId = updatePackageDto.clientId;
    }
    if (updatePackageDto.destinationId !== undefined) {
      pkg.destinationId = updatePackageDto.destinationId;
    }
    if (updatePackageDto.consultantId !== undefined) {
      pkg.consultantId = updatePackageDto.consultantId;
    }
    if (updatePackageDto.startDate !== undefined) {
      pkg.startDate = updatePackageDto.startDate
        ? new Date(updatePackageDto.startDate)
        : null;
    }
    if (updatePackageDto.numberOfDays !== undefined) {
      pkg.numberOfDays = updatePackageDto.numberOfDays;
    }
    if (updatePackageDto.adults !== undefined) {
      pkg.adults = updatePackageDto.adults;
    }
    if (updatePackageDto.children !== undefined) {
      pkg.children = updatePackageDto.children;
    }
    if (updatePackageDto.status !== undefined) {
      pkg.status = updatePackageDto.status;
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

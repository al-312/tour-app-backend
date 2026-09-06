import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  validatePhoneNumberLength,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';
import { UpdateConsultantDto } from '@/modules/consultants/dto/update-consultant.dto';
import { ConsultantResponseDto } from '@/modules/consultants/dto/consultant-response.dto';
import {
  Consultant,
  PhoneObject,
} from '@/modules/consultants/entities/consultant.entity';
import {
  CreateConsultantDto,
  PhoneDto,
} from '@/modules/consultants/dto/create-consultant.dto';

@Injectable()
export class ConsultantsService {
  constructor(
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  private validatePhone(phoneObj?: PhoneObject): void {
    if (!phoneObj) {
      return;
    }
    const num = phoneObj.number ?? phoneObj.phoneNumber;
    if (!num?.trim()) {
      return;
    }

    const cleanNumber = num.replace(/[^\d]/g, '');
    if (!cleanNumber) {
      return;
    }

    let iso: CountryCode = 'US';
    if (phoneObj.countryCode) {
      const cleanCallingCode = phoneObj.countryCode.replace(/[^\d]/g, '');
      const foundIso = getCountries().find(
        (c) => getCountryCallingCode(c) === cleanCallingCode,
      );
      if (foundIso) {
        iso = foundIso;
      }
    }

    const res = validatePhoneNumberLength(cleanNumber, iso);
    if (res === 'TOO_SHORT') {
      throw new BadRequestException(
        `Phone number is too short for selected country (${phoneObj.countryCode ?? '+1'})`,
      );
    }
    if (res === 'TOO_LONG') {
      throw new BadRequestException(
        `Phone number is too long for selected country (${phoneObj.countryCode ?? '+1'})`,
      );
    }
  }

  private parseConsultantName(dto: CreateConsultantDto): {
    firstName: string;
    lastName?: string | undefined;
    fullName: string;
  } {
    let firstName = dto.firstName;
    let lastName = dto.lastName;
    if (!firstName && dto.name) {
      const parts = dto.name.trim().split(' ');
      firstName = parts[0] ?? 'Consultant';
      lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
    }
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return { firstName: firstName || 'Consultant', lastName, fullName };
  }

  private buildPhoneObject(phoneDto?: PhoneDto): {
    phoneObj?: PhoneObject | undefined;
    phoneStr?: string | undefined;
  } {
    if (!phoneDto) {
      return {};
    }

    const num = phoneDto.number ?? phoneDto.phoneNumber;
    const phoneObj: PhoneObject = {};
    if (phoneDto.countryCode) {
      phoneObj.countryCode = phoneDto.countryCode;
    }
    if (num) {
      phoneObj.number = num;
      phoneObj.phoneNumber = num;
    }

    this.validatePhone(phoneObj);

    const phoneStr =
      [phoneObj.countryCode, num].filter(Boolean).join(' ') || undefined;

    return { phoneObj, phoneStr };
  }

  private async createAssociatedUser(
    email: string,
    fullName: string,
    tempPassword: string,
    designation?: string,
    phoneStr?: string,
  ): Promise<User | undefined> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return undefined;
    }

    const hashedPassword = await argon2.hash(tempPassword);
    const user = await this.usersService.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: UserRole.CONSULTANT,
    });
    user.mustChangePassword = true;
    user.status = 'ACTIVE';
    if (phoneStr) {
      user.phone = phoneStr;
    }
    if (designation) {
      user.companyName = designation;
    }
    await this.usersService.save(user);
    return user;
  }

  async create(
    createConsultantDto: CreateConsultantDto,
  ): Promise<Consultant & { temporaryPassword?: string }> {
    const tempPassword = `Temp${String(Math.floor(100000 + Math.random() * 900000))}!`;
    const { firstName, lastName, fullName } =
      this.parseConsultantName(createConsultantDto);
    const { phoneObj, phoneStr } = this.buildPhoneObject(
      createConsultantDto.phone,
    );

    let user: User | undefined;
    if (createConsultantDto.email) {
      user = await this.createAssociatedUser(
        createConsultantDto.email,
        fullName,
        tempPassword,
        createConsultantDto.designation,
        phoneStr,
      );
    }

    const consultantData: Partial<Consultant> = {
      firstName,
      designation: createConsultantDto.designation,
      ...(lastName ? { lastName } : {}),
      ...(phoneObj ? { phone: phoneObj } : {}),
      ...(createConsultantDto.email
        ? { email: createConsultantDto.email }
        : {}),
    };

    const consultant = this.consultantRepository.create(consultantData);
    const savedConsultant = await this.consultantRepository.save(consultant);

    await this.auditLogsService.logAction({
      actorId: user?.id ?? null,
      actorRole: 'ADMIN',
      action: 'CONSULTANT_CREATE',
      module: 'CONSULTANTS',
      entityType: 'Consultant',
      entityId: savedConsultant.id,
      summary: `Consultant ${savedConsultant.name} (${savedConsultant.email ?? 'N/A'}) created with temporary password.`,
    });

    return Object.assign(savedConsultant, { temporaryPassword: tempPassword });
  }

  async findAll(): Promise<ConsultantResponseDto[]> {
    const consultants = await this.consultantRepository.find({
      order: { firstName: 'ASC' },
    });
    return consultants.map((c) => ConsultantResponseDto.fromEntity(c));
  }

  async findById(id: string): Promise<Consultant> {
    const consultant = await this.consultantRepository.findOne({
      where: { id },
    });
    if (!consultant) {
      throw new NotFoundException(`Consultant with ID ${id} not found`);
    }
    return consultant;
  }

  async update(
    id: string,
    updateConsultantDto: UpdateConsultantDto,
  ): Promise<ConsultantResponseDto> {
    const consultant = await this.findById(id);
    if (updateConsultantDto.firstName !== undefined) {
      consultant.firstName = updateConsultantDto.firstName;
    }
    if (updateConsultantDto.lastName !== undefined) {
      consultant.lastName = updateConsultantDto.lastName;
    }
    if (updateConsultantDto.designation !== undefined) {
      consultant.designation = updateConsultantDto.designation;
    }
    if (updateConsultantDto.email !== undefined) {
      consultant.email = updateConsultantDto.email;
    }
    if (updateConsultantDto.phone !== undefined) {
      const { phoneObj } = this.buildPhoneObject(updateConsultantDto.phone);
      consultant.phone = phoneObj ?? null;
    }

    const updated = await this.consultantRepository.save(consultant);
    return ConsultantResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const consultant = await this.findById(id);
    await this.consultantRepository.remove(consultant);
  }
}

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';
import { CreateInquiryDto } from '@/modules/inquiries/dto/create-inquiry.dto';
import { calculateRoomAllocation } from '@/modules/hotels/utils/room-allocation.util';
import {
  Inquiry,
  InquiryStatus,
} from '@/modules/inquiries/entities/inquiry.entity';
import { UpdateInquiryStatusDto } from '@/modules/inquiries/dto/update-inquiry-status.dto';
import { generateInquiryVoucherHtml } from '@/modules/inquiries/utils/inquiry-voucher.util';
import { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(InquiryHotelSelection)
    private readonly selectionRepository: Repository<InquiryHotelSelection>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(consultantId: string, dto: CreateInquiryDto): Promise<Inquiry> {
    const pkg = await this.packageRepository.findOne({
      where: { id: dto.packageId },
      relations: {
        destination: true,
        packageDays: {
          destination: true,
          hotel: true,
        },
      },
    });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    if (
      pkg.destinationId &&
      dto.destinationId &&
      pkg.destinationId !== dto.destinationId
    ) {
      throw new BadRequestException('Package destination cannot be modified');
    }

    const client = await this.clientRepository.findOne({
      where: { id: dto.clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const count = await this.inquiryRepository.count();
    const inquiryNumber = `INQ-${String(new Date().getFullYear())}-${String(count + 1).padStart(6, '0')}`;

    let overallTotal = 0;
    const processedSelections: Array<{
      dayNumber: number;
      destinationId: string;
      hotelId: string;
      hotelName: string;
      roomTypeId: string;
      roomTypeName: string;
      numberOfRooms: number;
      numberOfExtraBeds: number;
      roomPrice: number;
      extraBedPrice: number;
      nights: number;
      calculatedTotal: number;
    }> = [];

    for (const selectionDto of dto.hotelSelections) {
      const hotel = await this.hotelRepository.findOne({
        where: { id: selectionDto.hotelId },
      });
      if (!hotel) {
        throw new NotFoundException(
          `Hotel with ID ${selectionDto.hotelId} not found`,
        );
      }

      if (hotel.destinationId !== selectionDto.destinationId) {
        throw new BadRequestException(
          `Hotel ${hotel.name} does not belong to destination of day ${String(selectionDto.dayNumber)}`,
        );
      }

      const roomType = await this.roomTypeRepository.findOne({
        where: { id: selectionDto.roomTypeId },
      });
      if (!roomType) {
        throw new NotFoundException(
          `Room type with ID ${selectionDto.roomTypeId} not found for hotel ${hotel.name}`,
        );
      }

      const nights = selectionDto.nights ?? 1;
      const allocation = calculateRoomAllocation(dto.adults, roomType, nights);

      overallTotal += allocation.calculatedTotal;

      processedSelections.push({
        dayNumber: selectionDto.dayNumber,
        destinationId: selectionDto.destinationId,
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        numberOfRooms: allocation.numberOfRooms,
        numberOfExtraBeds: allocation.numberOfExtraBeds,
        roomPrice: allocation.roomPrice,
        extraBedPrice: allocation.extraBedPrice,
        nights,
        calculatedTotal: allocation.calculatedTotal,
      });
    }

    const packageSnapshot = {
      packageId: pkg.id,
      packageName: pkg.packageName,
      source: dto.source,
      destinationId: dto.destinationId,
      destinationName: pkg.destination?.name ?? '',
      days: dto.days,
      adults: dto.adults,
      children: dto.children ?? 0,
      travelDate: dto.travelDate,
      itinerary: pkg.packageDays.map((pd) => ({
        dayNumber: pd.dayNumber,
        destinationId: pd.destinationId,
        destinationName: pd.destination?.name ?? '',
        notes: pd.notes,
      })),
      hotelSelections: processedSelections,
      calculatedTotal: overallTotal,
      snapshotCreatedAt: new Date().toISOString(),
    };

    const inquiry = this.inquiryRepository.create({
      inquiryNumber,
      consultantId,
      clientId: client.id,
      packageId: pkg.id,
      packageSnapshot,
      source: dto.source,
      destinationId: dto.destinationId,
      travelDate: new Date(dto.travelDate),
      days: dto.days,
      adults: dto.adults,
      children: dto.children ?? 0,
      calculatedTotal: overallTotal,
      approvedTotal: null,
      status: InquiryStatus.SUBMITTED,
      submittedAt: new Date(),
    });

    const savedInquiry = await this.inquiryRepository.save(inquiry);

    for (const sel of processedSelections) {
      const selection = this.selectionRepository.create({
        inquiryId: savedInquiry.id,
        dayNumber: sel.dayNumber,
        destinationId: sel.destinationId,
        hotelId: sel.hotelId,
        roomTypeId: sel.roomTypeId,
        numberOfRooms: sel.numberOfRooms,
        numberOfExtraBeds: sel.numberOfExtraBeds,
        roomPrice: sel.roomPrice,
        extraBedPrice: sel.extraBedPrice,
        nights: sel.nights,
        calculatedTotal: sel.calculatedTotal,
      });
      await this.selectionRepository.save(selection);
    }

    await this.auditLogsService.logAction({
      actorId: consultantId,
      actorRole: 'CONSULTANT',
      action: 'INQUIRY_SUBMIT',
      module: 'INQUIRIES',
      entityType: 'Inquiry',
      entityId: savedInquiry.id,
      summary: `Inquiry ${savedInquiry.inquiryNumber} submitted for client ${client.name}. Total: $${String(overallTotal)}`,
    });

    return this.findOne(savedInquiry.id);
  }

  async findAll(user: { id: string; role: UserRole }): Promise<Inquiry[]> {
    const qb = this.inquiryRepository
      .createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.consultant', 'consultant')
      .leftJoinAndSelect('inquiry.client', 'client')
      .leftJoinAndSelect('inquiry.package', 'package')
      .leftJoinAndSelect('inquiry.destination', 'destination')
      .leftJoinAndSelect('inquiry.hotelSelections', 'selections')
      .leftJoinAndSelect('selections.hotel', 'hotel')
      .leftJoinAndSelect('selections.roomType', 'roomType')
      .orderBy('inquiry.createdAt', 'DESC');

    if (user.role === UserRole.CONSULTANT) {
      qb.where('inquiry.consultantId = :consultantId', {
        consultantId: user.id,
      });
    }

    return qb.getMany();
  }

  async findOne(
    id: string,
    user?: { id: string; role: UserRole },
  ): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOne({
      where: { id },
      relations: {
        consultant: true,
        client: true,
        package: true,
        destination: true,
        hotelSelections: {
          hotel: true,
          roomType: true,
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }

    if (
      user?.role === UserRole.CONSULTANT &&
      inquiry.consultantId !== user.id
    ) {
      throw new ForbiddenException('Access denied to this inquiry');
    }

    return inquiry;
  }

  async updateStatus(
    id: string,
    adminUser: { id: string; role: UserRole },
    dto: UpdateInquiryStatusDto,
  ): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    const beforeStatus = inquiry.status;

    inquiry.status = dto.status;
    if (dto.notes !== undefined) {
      inquiry.notes = dto.notes;
    }

    if (dto.status === InquiryStatus.APPROVED) {
      inquiry.approvedAt = new Date();
      inquiry.approvedBy = adminUser.id;
      inquiry.approvedTotal = dto.approvedTotal ?? inquiry.calculatedTotal;
    } else if (dto.approvedTotal !== undefined) {
      inquiry.approvedTotal = dto.approvedTotal;
    }

    const updated = await this.inquiryRepository.save(inquiry);

    await this.auditLogsService.logAction({
      actorId: adminUser.id,
      actorRole: adminUser.role,
      action: 'INQUIRY_STATUS_CHANGE',
      module: 'INQUIRIES',
      entityType: 'Inquiry',
      entityId: updated.id,
      summary: `Inquiry ${updated.inquiryNumber} status changed from ${beforeStatus} to ${updated.status}`,
    });

    return updated;
  }

  async generatePdfHtml(
    id: string,
    user?: { id: string; role: UserRole },
  ): Promise<string> {
    const inquiry = await this.findOne(id, user);

    if (inquiry.status !== InquiryStatus.APPROVED) {
      throw new ForbiddenException(
        'PDF download is only available for approved inquiries',
      );
    }

    return generateInquiryVoucherHtml(inquiry);
  }
}

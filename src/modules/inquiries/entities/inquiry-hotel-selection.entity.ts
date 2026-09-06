import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';

@Entity('inquiry_hotel_selections')
export class InquiryHotelSelection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  inquiryId!: string;

  @ManyToOne('Inquiry', 'hotelSelections', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inquiryId' })
  inquiry!: Inquiry;

  @Column({ type: 'uuid', nullable: true })
  itineraryDayId!: string | null;

  @Column({ type: 'int' })
  dayNumber!: number;

  @Column({ type: 'uuid' })
  destinationId!: string;

  @Column({ type: 'uuid' })
  hotelId!: string;

  @ManyToOne('Hotel', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'hotelId' })
  hotel!: Hotel;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @ManyToOne('RoomType', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: RoomType;

  @Column({ type: 'int', default: 1 })
  numberOfRooms!: number;

  @Column({ type: 'int', default: 0 })
  numberOfExtraBeds!: number;

  @Column({ type: 'float', default: 0 })
  roomPrice!: number;

  @Column({ type: 'float', default: 0 })
  extraBedPrice!: number;

  @Column({ type: 'int', default: 1 })
  nights!: number;

  @Column({ type: 'float', default: 0 })
  calculatedTotal!: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { Hotel } from '@/modules/hotels/entities/hotel.entity';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  hotelId!: string | null;

  @ManyToOne('Hotel', 'roomTypes', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'hotelId' })
  hotel!: Hotel | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'float', default: 0 })
  roomPrice!: number;

  @Column({ type: 'int', default: 2 })
  maxAdults!: number;

  @Column({ type: 'int', default: 1 })
  maxChildren!: number;

  @Column({ type: 'boolean', default: false })
  extraBedAvailable!: boolean;

  @Column({ type: 'float', default: 0 })
  extraBedPrice!: number;

  @Column({ type: 'int', default: 0 })
  maxExtraBeds!: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

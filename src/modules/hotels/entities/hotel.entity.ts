import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { RoomType } from '@/modules/hotels/entities/room-type.entity';

import type { Destination } from '@/modules/destinations/entities/destination.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  destinationId!: string | null;

  @ManyToOne('Destination', 'hotels', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'destinationId' })
  destination!: Destination | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'float', default: 3 })
  starRating!: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status!: string;

  @OneToMany(() => RoomType, (roomType) => roomType.hotel, {
    cascade: true,
  })
  roomTypes!: RoomType[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

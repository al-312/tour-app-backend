import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
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

  @ManyToMany(() => RoomType, { cascade: true })
  @JoinTable({
    name: 'hotel_room_types',
    joinColumn: { name: 'hotel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'room_type_id', referencedColumnName: 'id' },
  })
  roomTypes!: RoomType[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

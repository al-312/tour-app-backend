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

import type { User } from '@/modules/users/entities/user.entity';
import type { Client } from '@/modules/clients/entities/client.entity';
import type { Package } from '@/modules/packages/entities/package.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';
import type { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

export enum InquiryStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  inquiryNumber!: string;

  @Column({ type: 'uuid' })
  consultantId!: string;

  @ManyToOne('User', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'consultantId' })
  consultant!: User;

  @Column({ type: 'uuid' })
  clientId!: string;

  @ManyToOne('Client', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column({ type: 'uuid' })
  packageId!: string;

  @ManyToOne('Package', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'packageId' })
  package!: Package;

  @Column({ type: 'jsonb', nullable: true })
  packageSnapshot!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 255 })
  source!: string;

  @Column({ type: 'uuid' })
  destinationId!: string;

  @ManyToOne('Destination', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'destinationId' })
  destination!: Destination;

  @Column({ type: 'date' })
  travelDate!: Date;

  @Column({ type: 'int', default: 1 })
  days!: number;

  @Column({ type: 'int', default: 1 })
  adults!: number;

  @Column({ type: 'int', default: 0 })
  children!: number;

  @Column({ type: 'float', default: 0 })
  calculatedTotal!: number;

  @Column({ type: 'float', nullable: true })
  approvedTotal!: number | null;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.SUBMITTED,
  })
  status!: InquiryStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  approvedBy!: string | null;

  @OneToMany('InquiryHotelSelection', 'inquiry', { cascade: true })
  hotelSelections!: InquiryHotelSelection[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

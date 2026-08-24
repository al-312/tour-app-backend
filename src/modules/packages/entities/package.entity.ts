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

import { PackageStatus } from '@/modules/packages/enums/package-status.enum';

import type { Client } from '@/modules/clients/entities/client.entity';
import type { PackageDay } from '@/modules/packages/entities/package-day.entity';
import type { Consultant } from '@/modules/consultants/entities/consultant.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  packageName!: string;

  @Column({ type: 'uuid', nullable: true })
  clientId!: string | null;

  @ManyToOne('Client', 'packages', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'clientId' })
  client!: Client | null;

  @Column({ type: 'uuid', nullable: true })
  destinationId!: string | null;

  @ManyToOne('Destination', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'destinationId' })
  destination!: Destination | null;

  @Column({ type: 'uuid', nullable: true })
  consultantId!: string | null;

  @ManyToOne('Consultant', 'packages', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant | null;

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'int', default: 1 })
  numberOfDays!: number;

  @Column({ type: 'int', default: 1 })
  adults!: number;

  @Column({ type: 'int', default: 0 })
  children!: number;

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.CONFIRMED,
  })
  status!: PackageStatus;

  @OneToMany('PackageDay', 'package', { cascade: true })
  packageDays!: PackageDay[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

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

import type { PackageDay } from '@/modules/packages/entities/package-day.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  packageName!: string;

  @Column({ type: 'varchar', length: 255, default: 'Bangalore' })
  source!: string;

  @Column({ type: 'uuid', nullable: true })
  destinationId!: string | null;

  @ManyToOne('Destination', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'destinationId' })
  destination!: Destination | null;

  @Column({ type: 'int', default: 1 })
  durationDays!: number;

  @Column({ type: 'timestamp', nullable: true })
  fromDatetimeUtc!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  toDatetimeUtc!: Date | null;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'float', default: 0 })
  startingPrice!: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status!: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy!: string | null;

  @OneToMany('PackageDay', 'package', { cascade: true })
  packageDays!: PackageDay[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

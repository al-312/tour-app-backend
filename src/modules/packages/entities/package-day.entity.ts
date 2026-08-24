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
import type { Package } from '@/modules/packages/entities/package.entity';

@Entity('package_days')
export class PackageDay {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  packageId!: string;

  @ManyToOne('Package', 'packageDays', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package!: Package;

  @Column({ type: 'int' })
  dayNumber!: number;

  @Column({ type: 'uuid', nullable: true })
  hotelId!: string | null;

  @ManyToOne('Hotel', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'hotelId' })
  hotel!: Hotel | null;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

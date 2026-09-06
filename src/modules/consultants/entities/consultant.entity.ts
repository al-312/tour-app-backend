import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import type { Package } from '@/modules/packages/entities/package.entity';

export interface PhoneObject {
  countryCode?: string | undefined;
  number?: string | undefined;
  phoneNumber?: string | undefined;
}

@Entity('consultants')
export class Consultant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  firstName!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 150 })
  designation!: string;

  @Column({ type: 'jsonb', nullable: true })
  phone?: PhoneObject | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @OneToMany('Package', 'consultant')
  packages!: Package[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get name(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }
}

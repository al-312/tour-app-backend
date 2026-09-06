import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '@/modules/roles/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status!: string;

  @Column({ type: 'boolean', default: false })
  mustChangePassword!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt!: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

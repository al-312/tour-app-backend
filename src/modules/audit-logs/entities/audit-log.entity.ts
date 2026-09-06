import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  actorId!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actorRole!: string | null;

  @Column({ type: 'varchar', length: 255 })
  action!: string;

  @Column({ type: 'varchar', length: 100 })
  module!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entityType!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityId!: string | null;

  @Column({ type: 'text', nullable: true })
  encryptedBeforeData!: string | null;

  @Column({ type: 'text', nullable: true })
  encryptedAfterData!: string | null;

  @Column({ type: 'text', nullable: true })
  redactedSummary!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

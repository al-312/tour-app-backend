import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(params: {
    actorId?: string | null;
    actorRole?: string | null;
    action: string;
    module: string;
    entityType?: string | null;
    entityId?: string | null;
    beforeData?: Record<string, unknown> | null;
    afterData?: Record<string, unknown> | null;
    summary?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuditLog> {
    const encryptedBefore = params.beforeData
      ? this.encryptPayload(params.beforeData)
      : null;
    const encryptedAfter = params.afterData
      ? this.encryptPayload(params.afterData)
      : null;
    const redactedSummary = this.redactSummary(
      params.summary ?? `${params.action} on ${params.module}`,
    );

    const log = this.auditLogRepository.create({
      actorId: params.actorId ?? null,
      actorRole: params.actorRole ?? null,
      action: params.action,
      module: params.module,
      entityType: params.entityType ?? null,
      entityId: params.entityId ?? null,
      encryptedBeforeData: encryptedBefore,
      encryptedAfterData: encryptedAfter,
      redactedSummary,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    });

    return this.auditLogRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  private encryptPayload(data: unknown): string {
    try {
      const sanitized = this.deepRedact(data);
      const json = JSON.stringify(sanitized);
      return Buffer.from(json).toString('base64');
    } catch {
      return '[ENCRYPTED_PAYLOAD_ERROR]';
    }
  }

  private deepRedact(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item: unknown) => this.deepRedact(item));
    }

    const recordObj = obj as Record<string, unknown>;
    const copy: Record<string, unknown> = {};
    for (const key of Object.keys(recordObj)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('password') ||
        lower.includes('token') ||
        lower.includes('secret')
      ) {
        copy[key] = '[REDACTED]';
      } else {
        copy[key] = this.deepRedact(recordObj[key]);
      }
    }
    return copy;
  }

  private redactSummary(summary: string): string {
    if (summary === '') {
      return '';
    }
    return summary
      .replace(/password[:=]\s*\S+/gi, 'password: [REDACTED]')
      .replace(/token[:=]\s*\S+/gi, 'token: [REDACTED]')
      .replace(
        /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        (_match: string, p1: string, p2: string) => {
          const firstChar = p1.charAt(0);
          return `${firstChar}***@${p2}`;
        },
      )
      .replace(
        /\+?(\d{1,3})?[-. ]?\(?\d{2,4}\)?[-. ]?\d{3,4}[-. ]?\d{3,4}/g,
        '+91*****1234',
      );
  }
}

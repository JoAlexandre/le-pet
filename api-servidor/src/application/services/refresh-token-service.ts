import crypto from 'crypto';
import { SessionRepository } from '../../domain/repositories/refresh-token-repository';
import { Session } from '../../domain/entities/refresh-token';
import { DomainError } from '../../shared/errors';

const SESSION_EXPIRY_DAYS = 7;

export interface SessionContext {
  authProvider?: string | null;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async create(userId: string, context: SessionContext = {}): Promise<string> {
    // Desativa todas as sessoes anteriores do usuario
    await this.sessionRepository.deactivateAllByUserId(userId);

    // Gera token opaco criptograficamente seguro
    const token = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

    await this.sessionRepository.create(
      new Session({
        id: crypto.randomUUID(),
        userId,
        authProvider: context.authProvider || null,
        token,
        expiresAt,
        deviceInfo: context.deviceInfo || null,
        ipAddress: context.ipAddress || null,
        userAgent: context.userAgent || null,
        isActive: true,
      }),
    );

    return token;
  }

  async validate(token: string): Promise<Session> {
    const session = await this.sessionRepository.findByToken(token);

    if (!session) {
      throw new DomainError('Session not found', 401);
    }

    if (!session.isActive) {
      throw new DomainError('Session has been deactivated', 401);
    }

    if (session.isExpired()) {
      throw new DomainError('Session expired', 401);
    }

    // Atualiza ultimo uso
    await this.sessionRepository.updateLastUsed(session.id!);

    return session;
  }

  async deactivateAllByUserId(userId: string): Promise<void> {
    await this.sessionRepository.deactivateAllByUserId(userId);
  }
}

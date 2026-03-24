import { SessionRepository } from '../../../domain/repositories/refresh-token-repository';
import { Session } from '../../../domain/entities/refresh-token';
import { SessionModel } from '../models/refresh-token-model';
import { Op } from 'sequelize';

export class SequelizeSessionRepository implements SessionRepository {
  async create(session: Session): Promise<Session> {
    const now = new Date();
    const record = await SessionModel.create({
      id: session.id!,
      userId: session.userId,
      authProvider: session.authProvider,
      token: session.token,
      expiresAt: session.expiresAt,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      isActive: session.isActive,
      createdAt: now,
      lastUsedAt: now,
    });

    return this.toDomain(record);
  }

  async findByToken(token: string): Promise<Session | null> {
    const record = await SessionModel.findOne({ where: { token } });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async deactivateAllByUserId(userId: string): Promise<void> {
    await SessionModel.update({ isActive: false }, { where: { userId, isActive: true } });
  }

  async updateLastUsed(id: string): Promise<void> {
    await SessionModel.update({ lastUsedAt: new Date() }, { where: { id } });
  }

  async deleteExpired(): Promise<void> {
    await SessionModel.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() },
      },
    });
  }

  private toDomain(record: SessionModel): Session {
    return new Session({
      id: record.id,
      userId: record.userId,
      authProvider: record.authProvider,
      token: record.token,
      expiresAt: record.expiresAt,
      deviceInfo: record.deviceInfo,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      isActive: record.isActive,
      createdAt: record.createdAt,
      lastUsedAt: record.lastUsedAt,
    });
  }
}

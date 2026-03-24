import session from 'express-session';
import { WebSessionModel } from '../../database/models/session-model';
import { logger } from '../../../shared/logger';
import { Op } from 'sequelize';

const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas

export class SequelizeSessionStore extends session.Store {
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super();
    // Limpa sessoes expiradas a cada hora
    this.cleanupInterval = setInterval(
      () => {
        this.clearExpired();
      },
      60 * 60 * 1000,
    );
  }

  get(
    sid: string,
    callback: (err?: Error | null, session?: session.SessionData | null) => void,
  ): void {
    WebSessionModel.findByPk(sid)
      .then((entry) => {
        if (!entry) {
          return callback(null, null);
        }

        if (new Date() > entry.expiresAt) {
          this.destroy(sid);
          return callback(null, null);
        }

        try {
          const data = JSON.parse(entry.data) as session.SessionData;
          callback(null, data);
        } catch {
          callback(null, null);
        }
      })
      .catch((err: Error) => {
        logger.error('Session store get error', err);
        callback(err);
      });
  }

  set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: Error | null) => void,
  ): void {
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
    const data = JSON.stringify(sessionData);
    const userId = sessionData.userId || null;

    WebSessionModel.upsert({
      sid,
      userId,
      data,
      expiresAt,
    })
      .then(() => {
        callback?.();
      })
      .catch((err: Error) => {
        logger.error('Session store set error', err);
        callback?.(err);
      });
  }

  destroy(sid: string, callback?: (err?: Error | null) => void): void {
    WebSessionModel.destroy({ where: { sid } })
      .then(() => {
        callback?.();
      })
      .catch((err: Error) => {
        logger.error('Session store destroy error', err);
        callback?.(err);
      });
  }

  private clearExpired(): void {
    WebSessionModel.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() },
      },
    }).catch((err) => {
      logger.error('Session cleanup error', err);
    });
  }

  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

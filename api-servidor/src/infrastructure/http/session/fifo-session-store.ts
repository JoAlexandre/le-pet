import session from 'express-session';
import { logger } from '../../../shared/logger';

const MAX_SESSIONS = 100;

interface SessionEntry {
  sid: string;
  data: session.SessionData;
  createdAt: number;
}

export class FifoSessionStore extends session.Store {
  private sessions: Map<string, SessionEntry> = new Map();

  get(
    sid: string,
    callback: (err?: Error | null, session?: session.SessionData | null) => void,
  ): void {
    const entry = this.sessions.get(sid);
    callback(null, entry ? entry.data : null);
  }

  set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: Error | null) => void,
  ): void {
    if (!this.sessions.has(sid) && this.sessions.size >= MAX_SESSIONS) {
      const oldest = this.sessions.keys().next().value;
      if (oldest) {
        this.sessions.delete(oldest);
        logger.debug(`FIFO evicted session: ${oldest}`);
      }
    }

    this.sessions.set(sid, {
      sid,
      data: sessionData,
      createdAt: Date.now(),
    });

    callback?.();
  }

  destroy(sid: string, callback?: (err?: Error | null) => void): void {
    this.sessions.delete(sid);
    callback?.();
  }

  length(callback: (err: Error | null, length: number) => void): void {
    callback(null, this.sessions.size);
  }

  clear(callback?: (err?: Error | null) => void): void {
    this.sessions.clear();
    callback?.();
  }
}

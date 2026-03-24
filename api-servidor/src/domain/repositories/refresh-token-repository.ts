import { Session } from '../entities/refresh-token';

export interface SessionRepository {
  create(session: Session): Promise<Session>;
  findByToken(token: string): Promise<Session | null>;
  deactivateAllByUserId(userId: string): Promise<void>;
  updateLastUsed(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

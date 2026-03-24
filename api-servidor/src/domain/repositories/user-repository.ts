import { User } from '../entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByProviderId(providerId: string): Promise<User | null>;
  findAllByRole(
    role: string,
    page: number,
    limit: number,
  ): Promise<{ rows: User[]; count: number }>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  softDelete(id: string): Promise<void>;
}

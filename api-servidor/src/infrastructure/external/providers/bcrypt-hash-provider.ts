import bcrypt from 'bcrypt';
import { HashProvider } from '../../../application/interfaces/hash-provider';

const SALT_ROUNDS = 10;

export class BcryptHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, SALT_ROUNDS);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}

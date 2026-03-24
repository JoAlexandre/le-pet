import { DomainError } from '../../shared/errors';

export class Password {
  public readonly value: string;

  constructor(password: string) {
    if (!Password.isValid(password)) {
      throw new DomainError(
        'Password must be at least 8 characters, contain 1 uppercase letter and 1 number',
      );
    }

    this.value = password;
  }

  private static isValid(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[0-9]/.test(password)) {
      return false;
    }
    return true;
  }
}

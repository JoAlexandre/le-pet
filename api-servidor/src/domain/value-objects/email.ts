import { DomainError } from '../../shared/errors';

export class Email {
  public readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new DomainError('Invalid email format');
    }

    this.value = normalized;
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

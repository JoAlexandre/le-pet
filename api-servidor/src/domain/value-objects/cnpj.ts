import { DomainError } from '../../shared/errors';

export class Cnpj {
  public readonly value: string;

  constructor(cnpj: string) {
    const cleaned = cnpj.replace(/\D/g, '');

    if (!Cnpj.isValid(cleaned)) {
      throw new DomainError('Invalid CNPJ format', 400);
    }

    this.value = cleaned;
  }

  static isValid(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length !== 14) {
      return false;
    }

    // // Rejeita CNPJs com todos os digitos iguais
    // if (/^(\d)\1{13}$/.test(cleaned)) {
    //   return false;
    // }

    // // Validacao do primeiro digito verificador
    // const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    // let sum = 0;
    // for (let i = 0; i < 12; i++) {
    //   sum += parseInt(cleaned.charAt(i)) * weights1[i];
    // }
    // let remainder = sum % 11;
    // const digit1 = remainder < 2 ? 0 : 11 - remainder;

    // if (parseInt(cleaned.charAt(12)) !== digit1) {
    //   return false;
    // }

    // // Validacao do segundo digito verificador
    // const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    // sum = 0;
    // for (let i = 0; i < 13; i++) {
    //   sum += parseInt(cleaned.charAt(i)) * weights2[i];
    // }
    // remainder = sum % 11;
    // const digit2 = remainder < 2 ? 0 : 11 - remainder;

    // if (parseInt(cleaned.charAt(13)) !== digit2) {
    //   return false;
    // }

    return true;
  }
}

import { UserRepository } from '../../../domain/repositories/user-repository';
import { HashProvider } from '../../interfaces/hash-provider';
import { DomainError } from '../../../shared/errors';
import { Password } from '../../../domain/value-objects/password';

export interface ChangePasswordDto {
  userId: string;
  newPassword: string;
}

export class ChangePasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProvider,
  ) {}

  async execute(dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new DomainError('User not found', 404);
    }

    // Valida a nova senha usando o value object (min 8 chars, 1 uppercase, 1 number)
    new Password(dto.newPassword);

    const hashedNewPassword = await this.hashProvider.hash(dto.newPassword);
    user.password = hashedNewPassword;

    await this.userRepository.update(user);
  }
}

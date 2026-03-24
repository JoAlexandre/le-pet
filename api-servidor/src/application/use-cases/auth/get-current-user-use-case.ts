import { UserRepository } from '../../../domain/repositories/user-repository';
import { DomainError } from '../../../shared/errors';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<ReturnType<typeof UserMapper.toResponse>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainError('User not found', 404);
    }

    return UserMapper.toResponse(user);
  }
}

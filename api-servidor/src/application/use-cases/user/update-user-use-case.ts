import { UserRepository } from '../../../domain/repositories/user-repository';
import { UpdateUserDto } from '../../dtos/update-user-dto';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string,
    requesterId: string,
    dto: UpdateUserDto,
  ): Promise<ReturnType<typeof UserMapper.toResponse>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainError('User not found', 404);
    }

    // Somente o proprio usuario pode atualizar seus dados
    if (user.id !== requesterId) {
      throw new DomainError('Access denied: you can only update your own profile', 403);
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    const updated = await this.userRepository.update(user);

    return UserMapper.toResponse(updated);
  }
}

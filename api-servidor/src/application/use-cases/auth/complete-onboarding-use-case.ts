import { UserRepository } from '../../../domain/repositories/user-repository';
import { TokenProvider } from '../../interfaces/token-provider';
import { Role } from '../../../domain/enums/role';
import { SpecialtyType } from '../../../domain/enums/specialty-type';
import { CrmvStatus } from '../../../domain/enums/crmv-status';
import { DomainError } from '../../../shared/errors';
import { CompleteOnboardingDto } from '../../dtos/complete-onboarding-dto';
import { AuthResponseDto } from '../../dtos/auth-response-dto';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';
import { SessionService } from '../../services/refresh-token-service';

export class CompleteOnboardingUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
  ) {}

  async execute(userId: string, dto: CompleteOnboardingDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainError('User not found', 404);
    }

    if (user.isOnboardingComplete) {
      throw new DomainError('Onboarding already completed', 400);
    }

    if (!Object.values(Role).includes(dto.role)) {
      throw new DomainError('Invalid role', 400);
    }

    user.role = dto.role;
    user.phone = dto.phone || null;

    if (dto.role === Role.PROFESSIONAL) {
      if (!dto.specialtyType || !Object.values(SpecialtyType).includes(dto.specialtyType)) {
        throw new DomainError('Specialty type is required for professionals', 400);
      }

      user.specialtyType = dto.specialtyType;

      if (dto.specialtyType === SpecialtyType.VETERINARIAN) {
        if (!dto.crmvNumber || !dto.crmvState) {
          throw new DomainError('CRMV number and state are required for veterinarians', 400);
        }

        user.crmvNumber = dto.crmvNumber;
        user.crmvState = dto.crmvState;
        user.crmvStatus = CrmvStatus.PENDING;
      }
    }

    user.isOnboardingComplete = true;

    const updatedUser = await this.userRepository.update(user);

    const token = this.tokenProvider.generate({
      sub: updatedUser.id!,
      role: updatedUser.role,
      specialtyType: updatedUser.specialtyType,
      crmvStatus: updatedUser.crmvStatus,
    });

    const refreshToken = await this.sessionService.create(updatedUser.id!, {
      authProvider: updatedUser.authProvider,
    });

    return {
      user: UserMapper.toResponse(updatedUser),
      token,
      refreshToken,
      isOnboardingComplete: true,
    };
  }
}

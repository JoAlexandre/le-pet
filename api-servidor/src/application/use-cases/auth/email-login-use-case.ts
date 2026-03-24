import { UserRepository } from '../../../domain/repositories/user-repository';
import { HashProvider } from '../../interfaces/hash-provider';
import { TokenProvider } from '../../interfaces/token-provider';
import { AuthProvider } from '../../../domain/enums/auth-provider';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials-error';
import { DomainError } from '../../../shared/errors';
import { AuthResponseDto } from '../../dtos/auth-response-dto';
import { EmailLoginDto } from '../../dtos/email-login-dto';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';
import { SessionService } from '../../services/refresh-token-service';

export class EmailLoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProvider,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
  ) {}

  async execute(dto: EmailLoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email.trim().toLowerCase());

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.authProvider !== AuthProvider.EMAIL) {
      throw new DomainError(
        'This account uses OAuth authentication. Please sign in with your OAuth provider.',
        400,
      );
    }

    if (!user.password) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashProvider.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new DomainError('Account is deactivated. Contact support.', 403);
    }

    const token = this.tokenProvider.generate({
      sub: user.id!,
      role: user.role,
      specialtyType: user.specialtyType,
      crmvStatus: user.crmvStatus,
    });

    const refreshToken = await this.sessionService.create(user.id!, {
      authProvider: AuthProvider.EMAIL,
    });

    return {
      user: UserMapper.toResponse(user),
      token,
      refreshToken,
      isOnboardingComplete: user.isOnboardingComplete,
    };
  }
}

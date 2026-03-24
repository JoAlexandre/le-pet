import { UserRepository } from '../../../domain/repositories/user-repository';
import { TokenProvider } from '../../interfaces/token-provider';
import { DomainError } from '../../../shared/errors';
import { AuthResponseDto } from '../../dtos/auth-response-dto';
import { RefreshTokenDto } from '../../dtos/refresh-token-dto';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';
import { SessionService } from '../../services/refresh-token-service';

export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // Valida a sessao (existe, ativa, nao expirada)
    const session = await this.sessionService.validate(dto.refreshToken);

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new DomainError('User not found', 404);
    }

    // Gera novo access token
    const token = this.tokenProvider.generate({
      sub: user.id!,
      role: user.role,
      specialtyType: user.specialtyType,
      crmvStatus: user.crmvStatus,
    });

    // Rotacao: desativa a antiga e cria nova sessao
    const refreshToken = await this.sessionService.create(user.id!, {
      authProvider: session.authProvider,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    });

    return {
      user: UserMapper.toResponse(user),
      token,
      refreshToken,
      isOnboardingComplete: user.isOnboardingComplete,
    };
  }
}

import { UserRepository } from '../../../domain/repositories/user-repository';
import { OAuthProvider } from '../../interfaces/oauth-provider';
import { TokenProvider } from '../../interfaces/token-provider';
import { AuthProvider } from '../../../domain/enums/auth-provider';
import { User } from '../../../domain/entities/user';
import { InvalidOAuthTokenError } from '../../../domain/errors/invalid-oauth-token-error';
import { ProviderMismatchError } from '../../../domain/errors/provider-mismatch-error';
import { DomainError } from '../../../shared/errors';
import { AuthResponseDto } from '../../dtos/auth-response-dto';
import { OAuthLoginDto } from '../../dtos/oauth-login-dto';
import { UserMapper } from '../../../infrastructure/http/mappers/user-mapper';
import { SessionService } from '../../services/refresh-token-service';

export class AppleAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private appleOAuthProvider: OAuthProvider,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
  ) {}

  async execute(dto: OAuthLoginDto): Promise<AuthResponseDto> {
    let oauthData;
    try {
      oauthData = await this.appleOAuthProvider.validateToken(dto.idToken);
    } catch {
      throw new InvalidOAuthTokenError();
    }

    // Apple envia nome apenas no primeiro login - usar firstName/lastName do DTO se disponivel
    const name =
      dto.firstName || dto.lastName
        ? `${dto.firstName || ''} ${dto.lastName || ''}`.trim()
        : oauthData.name;

    const existingUser = await this.userRepository.findByEmail(oauthData.email);

    if (existingUser) {
      if (existingUser.authProvider !== AuthProvider.APPLE) {
        throw new ProviderMismatchError();
      }

      if (!existingUser.isActive) {
        throw new DomainError('Account is deactivated. Contact support.', 403);
      }

      const token = this.tokenProvider.generate({
        sub: existingUser.id!,
        role: existingUser.role,
        specialtyType: existingUser.specialtyType,
        crmvStatus: existingUser.crmvStatus,
      });

      const refreshToken = await this.sessionService.create(existingUser.id!, {
        authProvider: AuthProvider.APPLE,
      });

      return {
        user: UserMapper.toResponse(existingUser),
        token,
        refreshToken,
        isOnboardingComplete: existingUser.isOnboardingComplete,
      };
    }

    const newUser = new User({
      name: name || 'Apple User',
      email: oauthData.email,
      authProvider: AuthProvider.APPLE,
      providerId: oauthData.providerId,
      isActive: true,
      isOnboardingComplete: false,
    });

    const createdUser = await this.userRepository.create(newUser);

    const token = this.tokenProvider.generate({
      sub: createdUser.id!,
      role: createdUser.role,
    });

    const refreshToken = await this.sessionService.create(createdUser.id!, {
      authProvider: AuthProvider.APPLE,
    });

    return {
      user: UserMapper.toResponse(createdUser),
      token,
      refreshToken,
      isOnboardingComplete: false,
    };
  }
}

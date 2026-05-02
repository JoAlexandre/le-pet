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
import { logger } from '../../../shared/logger';

export class GoogleAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private googleOAuthProvider: OAuthProvider,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
  ) {}

  async execute(dto: OAuthLoginDto): Promise<AuthResponseDto> {
    let oauthData;
    try {
      oauthData = await this.googleOAuthProvider.validateToken(dto.idToken);
    } catch (err) {
      logger.warn('Google token validation failed', { error: (err as Error).message, name: (err as Error).name });
      throw new InvalidOAuthTokenError();
    }

    const existingUser = await this.userRepository.findByEmail(oauthData.email);

    if (existingUser) {
      if (existingUser.authProvider !== AuthProvider.GOOGLE) {
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
        authProvider: AuthProvider.GOOGLE,
      });

      return {
        user: UserMapper.toResponse(existingUser),
        token,
        refreshToken,
        isOnboardingComplete: existingUser.isOnboardingComplete,
      };
    }

    const newUser = new User({
      name: oauthData.name,
      email: oauthData.email,
      authProvider: AuthProvider.GOOGLE,
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
      authProvider: AuthProvider.GOOGLE,
    });

    return {
      user: UserMapper.toResponse(createdUser),
      token,
      refreshToken,
      isOnboardingComplete: false,
    };
  }
}

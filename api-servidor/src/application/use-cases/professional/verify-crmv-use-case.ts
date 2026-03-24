import { UserRepository } from '../../../domain/repositories/user-repository';
import { TokenProvider } from '../../interfaces/token-provider';
import { CrmvValidationProvider } from '../../interfaces/crmv-validation-provider';
import { SessionService } from '../../services/refresh-token-service';
import { ProfessionalResponseDto } from '../../dtos/professional-response-dto';
import { ProfessionalMapper } from '../../../infrastructure/http/mappers/professional-mapper';
import { DomainError } from '../../../shared/errors';
import { Role } from '../../../domain/enums/role';
import { SpecialtyType } from '../../../domain/enums/specialty-type';
import { CrmvStatus } from '../../../domain/enums/crmv-status';
import { logger } from '../../../shared/logger';

export class VerifyCrmvUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider,
    private sessionService: SessionService,
    private crmvValidationProvider: CrmvValidationProvider,
  ) {}

  async execute(
    professionalId: string,
  ): Promise<{ professional: ProfessionalResponseDto; token: string; refreshToken: string }> {
    const user = await this.userRepository.findById(professionalId);
    if (!user || user.role !== Role.PROFESSIONAL) {
      throw new DomainError('Professional not found', 404);
    }

    if (user.specialtyType !== SpecialtyType.VETERINARIAN) {
      throw new DomainError('Only veterinarians can verify CRMV', 400);
    }

    if (!user.crmvNumber || !user.crmvState) {
      throw new DomainError('CRMV number and state must be set before verification', 400);
    }

    if (user.crmvStatus === CrmvStatus.VERIFIED) {
      throw new DomainError('CRMV is already verified', 400);
    }

    logger.info(
      `[VerifyCrmv] Starting verification for professional=${professionalId}, ` +
        `crmvNumber=${user.crmvNumber}, crmvState=${user.crmvState}`,
    );

    // Consulta o CFMV via web scraping (Playwright)
    const cfmvResult = await this.crmvValidationProvider.validate(user.crmvNumber, user.crmvState);

    logger.info(
      `[VerifyCrmv] CFMV result: found=${cfmvResult.found}, active=${cfmvResult.active}, ` +
        `name=${cfmvResult.name}, registrationNumber=${cfmvResult.registrationNumber}`,
    );

    if (!cfmvResult.found) {
      logger.warn(`[VerifyCrmv] CRMV not found, setting status to REJECTED`);
      user.crmvStatus = CrmvStatus.REJECTED;
      await this.userRepository.update(user);
      throw new DomainError(
        'CRMV registration not found in CFMV database. Status set to REJECTED.',
        404,
      );
    }

    if (!cfmvResult.active) {
      logger.warn(`[VerifyCrmv] CRMV inactive, setting status to REJECTED`);
      user.crmvStatus = CrmvStatus.REJECTED;
      await this.userRepository.update(user);
      throw new DomainError(
        'CRMV registration is inactive in CFMV database. Status set to REJECTED.',
        400,
      );
    }

    logger.info(`[VerifyCrmv] CRMV verified successfully, setting status to VERIFIED`);

    // Validacao passou - marca como VERIFIED
    user.crmvStatus = CrmvStatus.VERIFIED;
    const updated = await this.userRepository.update(user);

    // Gera novo JWT com crmvStatus atualizado
    const token = this.tokenProvider.generate({
      sub: updated.id!,
      role: updated.role,
      specialtyType: updated.specialtyType,
      crmvStatus: updated.crmvStatus,
    });

    const refreshToken = await this.sessionService.create(updated.id!);

    return {
      professional: ProfessionalMapper.toResponse(updated),
      token,
      refreshToken,
    };
  }
}

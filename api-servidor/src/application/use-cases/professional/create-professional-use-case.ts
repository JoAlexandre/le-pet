import { UserRepository } from '../../../domain/repositories/user-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { HashProvider } from '../../interfaces/hash-provider';
import { User } from '../../../domain/entities/user';
import { CompanyProfessional } from '../../../domain/entities/company-professional';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { Role } from '../../../domain/enums/role';
import { AuthProvider } from '../../../domain/enums/auth-provider';
import { SpecialtyType } from '../../../domain/enums/specialty-type';
import { CrmvStatus } from '../../../domain/enums/crmv-status';
import { EmailAlreadyExistsError } from '../../../domain/errors/email-already-exists-error';
import { DomainError } from '../../../shared/errors';
import { CreateProfessionalDto } from '../../dtos/create-professional-dto';
import { ProfessionalResponseDto } from '../../dtos/professional-response-dto';
import { ProfessionalMapper } from '../../../infrastructure/http/mappers/professional-mapper';

export class CreateProfessionalUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository,
    private companyProfessionalRepository: CompanyProfessionalRepository,
    private hashProvider: HashProvider,
  ) {}

  async execute(requesterId: string, dto: CreateProfessionalDto): Promise<ProfessionalResponseDto> {
    // Valida email
    const email = new Email(dto.email);

    // Valida senha
    new Password(dto.password);

    // Valida specialtyType
    if (!Object.values(SpecialtyType).includes(dto.specialtyType as SpecialtyType)) {
      throw new DomainError('Invalid specialty type', 400);
    }

    const specialtyType = dto.specialtyType as SpecialtyType;

    // Valida CRMV para veterinarios
    if (specialtyType === SpecialtyType.VETERINARIAN) {
      if (!dto.crmvNumber || !dto.crmvState) {
        throw new DomainError('CRMV number and state are required for veterinarians', 400);
      }
    }

    // Verifica se o email ja esta em uso
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    // Verifica se o requisitante possui uma empresa
    const company = await this.companyRepository.findByUserId(requesterId);
    if (!company) {
      throw new DomainError('You must have a company to create a professional', 400);
    }

    // Hash da senha
    const hashedPassword = await this.hashProvider.hash(dto.password);

    // Cria o usuario profissional
    const user = new User({
      name: dto.name,
      email: email.value,
      password: hashedPassword,
      role: Role.PROFESSIONAL,
      authProvider: AuthProvider.EMAIL,
      specialtyType,
      crmvNumber: dto.crmvNumber || null,
      crmvState: dto.crmvState || null,
      crmvStatus: specialtyType === SpecialtyType.VETERINARIAN ? CrmvStatus.PENDING : null,
      phone: dto.phone || null,
      isActive: true,
      isOnboardingComplete: true,
    });

    const createdUser = await this.userRepository.create(user);

    // Associa o profissional a empresa do requisitante
    const association = new CompanyProfessional({
      companyId: company.id!,
      userId: createdUser.id!,
    });
    await this.companyProfessionalRepository.create(association);

    return ProfessionalMapper.toResponse(createdUser);
  }
}

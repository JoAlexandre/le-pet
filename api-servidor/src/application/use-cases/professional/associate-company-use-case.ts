import { UserRepository } from '../../../domain/repositories/user-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { CompanyProfessional } from '../../../domain/entities/company-professional';
import { DomainError } from '../../../shared/errors';
import { Role } from '../../../domain/enums/role';

export class AssociateCompanyUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository,
    private companyProfessionalRepository: CompanyProfessionalRepository,
  ) {}

  async execute(professionalId: string, companyId: string): Promise<{ message: string }> {
    // Valida que o usuario eh profissional
    const user = await this.userRepository.findById(professionalId);
    if (!user || user.role !== Role.PROFESSIONAL) {
      throw new DomainError('Professional not found', 404);
    }

    // Valida que a empresa existe e esta ativa
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new DomainError('Company not found', 404);
    }

    if (!company.isActive) {
      throw new DomainError('Company is deactivated', 403);
    }

    // Verifica se ja existe vinculo
    const existing = await this.companyProfessionalRepository.findByCompanyAndUser(
      companyId,
      professionalId,
    );
    if (existing) {
      throw new DomainError('Professional is already associated with this company', 409);
    }

    const association = new CompanyProfessional({
      companyId,
      userId: professionalId,
    });

    await this.companyProfessionalRepository.create(association);

    return { message: 'Professional successfully associated with company' };
  }
}

import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { PlanResponseDto } from '../../dtos/plan-response-dto';
import { Role } from '../../../domain/enums/role';

export class ListPlansUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(role?: string): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.findAll();

    const filtered = role ? plans.filter((p) => p.role === (role as Role)) : plans;

    return filtered.map((plan) => ({
      id: plan.id!,
      name: plan.name,
      slug: plan.slug,
      tier: plan.tier,
      role: plan.role,
      price: plan.price,
      currency: plan.currency,
      intervalMonths: plan.intervalMonths,
      limits: plan.limits,
    }));
  }
}

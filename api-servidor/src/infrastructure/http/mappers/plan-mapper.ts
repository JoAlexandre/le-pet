import { Plan } from '../../../domain/entities/plan';
import { PlanResponseDto } from '../../../application/dtos/plan-response-dto';

export class PlanMapper {
  static toResponse(plan: Plan): PlanResponseDto {
    return {
      id: plan.id!,
      name: plan.name,
      slug: plan.slug,
      tier: plan.tier,
      role: plan.role,
      price: plan.price,
      currency: plan.currency,
      intervalMonths: plan.intervalMonths,
      limits: plan.limits,
    };
  }
}

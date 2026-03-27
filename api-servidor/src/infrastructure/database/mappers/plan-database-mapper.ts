import { Plan, PlanLimits } from '../../../domain/entities/plan';
import { PlanTier } from '../../../domain/enums/plan-tier';
import { Role } from '../../../domain/enums/role';
import { PlanModel } from '../models/plan-model';

export class PlanDatabaseMapper {
  static toDomain(model: PlanModel): Plan {
    const limits: PlanLimits =
      typeof model.limits === 'string'
        ? (JSON.parse(model.limits) as PlanLimits)
        : (model.limits as unknown as PlanLimits);

    return new Plan({
      id: model.id,
      name: model.name,
      slug: model.slug,
      tier: model.tier as PlanTier,
      role: model.role as Role,
      price: Number(model.price),
      currency: model.currency,
      intervalMonths: model.intervalMonths,
      stripePriceId: model.stripePriceId,
      limits,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: Plan): Partial<PlanModel> {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      tier: entity.tier,
      role: entity.role,
      price: entity.price,
      currency: entity.currency,
      intervalMonths: entity.intervalMonths,
      stripePriceId: entity.stripePriceId,
      limits: JSON.stringify(entity.limits) as unknown as string,
      isActive: entity.isActive,
    };
  }
}

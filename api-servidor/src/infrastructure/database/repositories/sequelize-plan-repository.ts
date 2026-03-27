import { Plan } from '../../../domain/entities/plan';
import { PlanTier } from '../../../domain/enums/plan-tier';
import { Role } from '../../../domain/enums/role';
import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { PlanModel } from '../models/plan-model';
import { PlanDatabaseMapper } from '../mappers/plan-database-mapper';

export class SequelizePlanRepository implements PlanRepository {
  async findAll(): Promise<Plan[]> {
    const models = await PlanModel.findAll({
      where: { isActive: true },
      order: [
        ['role', 'ASC'],
        ['price', 'ASC'],
      ],
    });
    return models.map((model) => PlanDatabaseMapper.toDomain(model));
  }

  async findById(id: string): Promise<Plan | null> {
    const model = await PlanModel.findByPk(id);
    return model ? PlanDatabaseMapper.toDomain(model) : null;
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const model = await PlanModel.findOne({ where: { slug } });
    return model ? PlanDatabaseMapper.toDomain(model) : null;
  }

  async findByRoleAndTier(role: Role, tier: PlanTier): Promise<Plan | null> {
    const model = await PlanModel.findOne({ where: { role, tier } });
    return model ? PlanDatabaseMapper.toDomain(model) : null;
  }
}

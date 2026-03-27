import { Plan } from '../entities/plan';
import { PlanTier } from '../enums/plan-tier';
import { Role } from '../enums/role';

export interface PlanRepository {
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  findBySlug(slug: string): Promise<Plan | null>;
  findByRoleAndTier(role: Role, tier: PlanTier): Promise<Plan | null>;
}

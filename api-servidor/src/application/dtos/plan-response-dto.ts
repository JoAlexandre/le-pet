import { PlanLimits } from '../../domain/entities/plan';

export interface PlanResponseDto {
  id: string;
  name: string;
  slug: string;
  tier: string;
  role: string;
  price: number;
  currency: string;
  intervalMonths: number;
  limits: PlanLimits;
}

import { PlanLimits } from '../../domain/entities/plan';

export interface SubscriptionResponseDto {
  id: string | null;
  userId: string;
  planId: string;
  planName: string;
  planSlug: string;
  tier: string;
  role: string;
  price: number;
  currency: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  limits: PlanLimits;
}

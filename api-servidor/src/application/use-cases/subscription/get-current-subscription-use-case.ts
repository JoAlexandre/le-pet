import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { PlanTier } from '../../../domain/enums/plan-tier';
import { Role } from '../../../domain/enums/role';
import { SubscriptionResponseDto } from '../../dtos/subscription-response-dto';

export class GetCurrentSubscriptionUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute(userId: string, userRole: Role): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findActiveByUserId(userId);

    if (subscription) {
      const plan = await this.planRepository.findById(subscription.planId);
      if (plan) {
        return {
          id: subscription.id!,
          userId: subscription.userId,
          planId: plan.id!,
          planName: plan.name,
          planSlug: plan.slug,
          tier: plan.tier,
          role: plan.role,
          price: plan.price,
          currency: plan.currency,
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart.toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          limits: plan.limits,
        };
      }
    }

    const freePlan = await this.planRepository.findByRoleAndTier(userRole, PlanTier.FREE);
    if (!freePlan) {
      throw new Error('Free plan not found for role: ' + userRole);
    }

    return {
      id: null,
      userId,
      planId: freePlan.id!,
      planName: freePlan.name,
      planSlug: freePlan.slug,
      tier: freePlan.tier,
      role: freePlan.role,
      price: freePlan.price,
      currency: freePlan.currency,
      status: 'ACTIVE',
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      limits: freePlan.limits,
    };
  }
}

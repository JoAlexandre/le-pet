import { Subscription } from '../../../domain/entities/subscription';
import { Plan } from '../../../domain/entities/plan';
import { SubscriptionResponseDto } from '../../../application/dtos/subscription-response-dto';

export class SubscriptionMapper {
  static toResponse(subscription: Subscription, plan: Plan): SubscriptionResponseDto {
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

  static toFreeResponse(userId: string, plan: Plan): SubscriptionResponseDto {
    return {
      id: null,
      userId,
      planId: plan.id!,
      planName: plan.name,
      planSlug: plan.slug,
      tier: plan.tier,
      role: plan.role,
      price: plan.price,
      currency: plan.currency,
      status: 'ACTIVE',
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      limits: plan.limits,
    };
  }
}

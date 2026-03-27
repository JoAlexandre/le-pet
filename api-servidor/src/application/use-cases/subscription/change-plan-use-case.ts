import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PaymentGatewayProvider } from '../../interfaces/payment-gateway-provider';
import { SubscriptionNotFoundError } from '../../../domain/errors/subscription-not-found-error';
import { InvalidPlanChangeError } from '../../../domain/errors/invalid-plan-change-error';
import { DomainError } from '../../../shared/errors';
import { ChangePlanDto } from '../../dtos/change-plan-dto';
import { SubscriptionResponseDto } from '../../dtos/subscription-response-dto';

export class ChangePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
    private paymentGatewayProvider: PaymentGatewayProvider,
  ) {}

  async execute(userId: string, dto: ChangePlanDto): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findActiveByUserId(userId);
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new SubscriptionNotFoundError();
    }

    const currentPlan = await this.planRepository.findById(subscription.planId);
    if (!currentPlan) {
      throw new DomainError('Current plan not found', 404);
    }

    const newPlan = await this.planRepository.findById(dto.newPlanId);
    if (!newPlan) {
      throw new DomainError('New plan not found', 404);
    }

    if (newPlan.id === currentPlan.id) {
      throw new InvalidPlanChangeError('Cannot change to the same plan');
    }

    if (newPlan.role !== currentPlan.role) {
      throw new InvalidPlanChangeError('Cannot change to a plan of a different role');
    }

    if (!newPlan.stripePriceId) {
      throw new InvalidPlanChangeError('Target plan is not available for subscription');
    }

    await this.paymentGatewayProvider.changeSubscription(
      subscription.stripeSubscriptionId,
      newPlan.stripePriceId,
    );

    subscription.planId = newPlan.id!;
    const updated = await this.subscriptionRepository.update(subscription);

    return {
      id: updated.id!,
      userId: updated.userId,
      planId: newPlan.id!,
      planName: newPlan.name,
      planSlug: newPlan.slug,
      tier: newPlan.tier,
      role: newPlan.role,
      price: newPlan.price,
      currency: newPlan.currency,
      status: updated.status,
      currentPeriodStart: updated.currentPeriodStart.toISOString(),
      currentPeriodEnd: updated.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
      limits: newPlan.limits,
    };
  }
}

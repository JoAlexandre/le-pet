import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { PaymentGatewayProvider } from '../../interfaces/payment-gateway-provider';
import { PlanTier } from '../../../domain/enums/plan-tier';
import { DomainError } from '../../../shared/errors';
import { CreateCheckoutDto } from '../../dtos/create-checkout-dto';
import { CheckoutResponseDto } from '../../dtos/checkout-response-dto';

export class CreateCheckoutUseCase {
  constructor(
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
    private paymentGatewayProvider: PaymentGatewayProvider,
    private userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateCheckoutDto,
    successUrl: string,
    cancelUrl: string,
  ): Promise<CheckoutResponseDto> {
    const plan = await this.planRepository.findById(dto.planId);
    if (!plan) {
      throw new DomainError('Plan not found', 404);
    }

    if (plan.tier === PlanTier.FREE) {
      throw new DomainError('Cannot checkout a free plan', 400);
    }

    if (!plan.stripePriceId) {
      throw new DomainError('Plan is not available for purchase', 400);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError('User not found', 404);
    }

    // Reutiliza o customer do Stripe se ja existe na subscription ativa
    let stripeCustomerId: string;
    const existingSubscription = await this.subscriptionRepository.findActiveByUserId(userId);

    if (existingSubscription?.stripeCustomerId) {
      stripeCustomerId = existingSubscription.stripeCustomerId;
    } else {
      stripeCustomerId = await this.paymentGatewayProvider.createCustomer(user.email, user.name);
    }

    const session = await this.paymentGatewayProvider.createCheckoutSession(
      stripeCustomerId,
      plan.stripePriceId,
      successUrl,
      cancelUrl,
    );

    return {
      clientSecret: session.clientSecret,
      sessionId: session.sessionId,
    };
  }
}

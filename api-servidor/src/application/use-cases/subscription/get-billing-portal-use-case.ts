import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PaymentGatewayProvider } from '../../interfaces/payment-gateway-provider';
import { SubscriptionNotFoundError } from '../../../domain/errors/subscription-not-found-error';

export class GetBillingPortalUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private paymentGatewayProvider: PaymentGatewayProvider,
  ) {}

  async execute(userId: string, returnUrl: string): Promise<{ url: string }> {
    const subscription = await this.subscriptionRepository.findActiveByUserId(userId);
    if (!subscription || !subscription.stripeCustomerId) {
      throw new SubscriptionNotFoundError();
    }

    return this.paymentGatewayProvider.createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl,
    );
  }
}

import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PaymentGatewayProvider } from '../../interfaces/payment-gateway-provider';
import { SubscriptionNotFoundError } from '../../../domain/errors/subscription-not-found-error';

export class CancelSubscriptionUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private paymentGatewayProvider: PaymentGatewayProvider,
  ) {}

  async execute(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findActiveByUserId(userId);
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new SubscriptionNotFoundError();
    }

    await this.paymentGatewayProvider.cancelSubscription(subscription.stripeSubscriptionId);

    subscription.cancelAtPeriodEnd = true;
    await this.subscriptionRepository.update(subscription);
  }
}

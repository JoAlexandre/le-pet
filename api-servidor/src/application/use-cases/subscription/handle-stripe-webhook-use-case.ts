import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { PaymentGatewayProvider } from '../../interfaces/payment-gateway-provider';
import { Subscription } from '../../../domain/entities/subscription';
import { SubscriptionStatus } from '../../../domain/enums/subscription-status';
import { logger } from '../../../shared/logger';

export class HandleStripeWebhookUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private planRepository: PlanRepository,
    private paymentGatewayProvider: PaymentGatewayProvider,
  ) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    const event = this.paymentGatewayProvider.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: any): Promise<void> {
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;
    const metadata = session.metadata || {};
    const userId = metadata.userId as string;
    const planId = metadata.planId as string;

    if (!stripeSubscriptionId || !userId || !planId) {
      logger.warn('Missing data in checkout.session.completed event');
      return;
    }

    const existing =
      await this.subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (existing) {
      return;
    }

    const subscription = new Subscription({
      userId,
      planId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    });

    await this.subscriptionRepository.create(subscription);
  }

  private async handleInvoicePaid(invoice: any): Promise<void> {
    const stripeSubscriptionId = invoice.subscription as string;
    if (!stripeSubscriptionId) {
      return;
    }

    const subscription =
      await this.subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) {
      return;
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    if (invoice.lines?.data?.[0]?.period) {
      const period = invoice.lines.data[0].period;
      subscription.currentPeriodStart = new Date(period.start * 1000);
      subscription.currentPeriodEnd = new Date(period.end * 1000);
    }

    await this.subscriptionRepository.update(subscription);
  }

  private async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    const stripeSubscriptionId = invoice.subscription as string;
    if (!stripeSubscriptionId) {
      return;
    }

    const subscription =
      await this.subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) {
      return;
    }

    subscription.status = SubscriptionStatus.PAST_DUE;
    await this.subscriptionRepository.update(subscription);
  }

  private async handleSubscriptionUpdated(stripeSubscription: any): Promise<void> {
    const stripeSubscriptionId = stripeSubscription.id as string;

    const subscription =
      await this.subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) {
      return;
    }

    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end ?? false;

    if (stripeSubscription.current_period_start) {
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    }
    if (stripeSubscription.current_period_end) {
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    }

    const statusMap: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELED,
      trialing: SubscriptionStatus.TRIALING,
      incomplete: SubscriptionStatus.INCOMPLETE,
    };

    if (stripeSubscription.status && statusMap[stripeSubscription.status]) {
      subscription.status = statusMap[stripeSubscription.status];
    }

    await this.subscriptionRepository.update(subscription);
  }

  private async handleSubscriptionDeleted(stripeSubscription: any): Promise<void> {
    const stripeSubscriptionId = stripeSubscription.id as string;

    const subscription =
      await this.subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) {
      return;
    }

    subscription.status = SubscriptionStatus.CANCELED;
    await this.subscriptionRepository.update(subscription);
  }
}

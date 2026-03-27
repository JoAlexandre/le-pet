import Stripe from 'stripe';
import { PaymentGatewayProvider } from '../../../application/interfaces/payment-gateway-provider';
import { config } from '../../../shared/config';

export class StripePaymentGatewayProvider implements PaymentGatewayProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  async createCustomer(email: string, name: string): Promise<string> {
    const customer = await this.stripe.customers.create({ email, name });
    return customer.id;
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; clientSecret: string }> {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      sessionId: session.id,
      clientSecret: session.url ?? '',
    };
  }

  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<{ url: string }> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  }

  async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async changeSubscription(stripeSubscriptionId: string, newPriceId: string): Promise<void> {
    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const itemId = subscription.items.data[0]?.id;

    if (!itemId) {
      throw new Error('No subscription item found');
    }

    await this.stripe.subscriptions.update(stripeSubscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    });
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  }
}

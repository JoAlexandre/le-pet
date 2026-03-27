export interface PaymentGatewayProvider {
  createCustomer(email: string, name: string): Promise<string>;
  createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; clientSecret: string }>;
  createBillingPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }>;
  cancelSubscription(stripeSubscriptionId: string): Promise<void>;
  changeSubscription(stripeSubscriptionId: string, newPriceId: string): Promise<void>;
  constructWebhookEvent(payload: Buffer, signature: string): any;
}

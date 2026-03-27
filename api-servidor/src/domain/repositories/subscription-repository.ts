import { Subscription } from '../entities/subscription';

export interface SubscriptionRepository {
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<Subscription>;
  update(subscription: Subscription): Promise<Subscription>;
  findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null>;
}

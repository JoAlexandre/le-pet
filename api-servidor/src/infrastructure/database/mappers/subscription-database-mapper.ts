import { Subscription } from '../../../domain/entities/subscription';
import { SubscriptionStatus } from '../../../domain/enums/subscription-status';
import { SubscriptionModel } from '../models/subscription-model';

export class SubscriptionDatabaseMapper {
  static toDomain(model: SubscriptionModel): Subscription {
    return new Subscription({
      id: model.id,
      userId: model.userId,
      planId: model.planId,
      stripeCustomerId: model.stripeCustomerId,
      stripeSubscriptionId: model.stripeSubscriptionId,
      status: model.status as SubscriptionStatus,
      currentPeriodStart: model.currentPeriodStart,
      currentPeriodEnd: model.currentPeriodEnd,
      cancelAtPeriodEnd: model.cancelAtPeriodEnd,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: Subscription): Partial<SubscriptionModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      planId: entity.planId,
      stripeCustomerId: entity.stripeCustomerId,
      stripeSubscriptionId: entity.stripeSubscriptionId,
      status: entity.status,
      currentPeriodStart: entity.currentPeriodStart,
      currentPeriodEnd: entity.currentPeriodEnd,
      cancelAtPeriodEnd: entity.cancelAtPeriodEnd,
    };
  }
}

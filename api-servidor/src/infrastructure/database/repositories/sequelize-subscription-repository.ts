import { Op } from 'sequelize';
import { Subscription } from '../../../domain/entities/subscription';
import { SubscriptionStatus } from '../../../domain/enums/subscription-status';
import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { SubscriptionModel } from '../models/subscription-model';
import { SubscriptionDatabaseMapper } from '../mappers/subscription-database-mapper';

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const model = await SubscriptionModel.findOne({
      where: {
        userId,
        status: {
          [Op.in]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      },
    });
    return model ? SubscriptionDatabaseMapper.toDomain(model) : null;
  }

  async create(subscription: Subscription): Promise<Subscription> {
    const data = SubscriptionDatabaseMapper.toModel(subscription);
    const model = await SubscriptionModel.create(data as SubscriptionModel);
    return SubscriptionDatabaseMapper.toDomain(model);
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const data = SubscriptionDatabaseMapper.toModel(subscription);
    await SubscriptionModel.update(data, { where: { id: subscription.id } });
    const updated = await SubscriptionModel.findByPk(subscription.id);
    return SubscriptionDatabaseMapper.toDomain(updated!);
  }

  async findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null> {
    const model = await SubscriptionModel.findOne({
      where: { stripeSubscriptionId: stripeSubId },
    });
    return model ? SubscriptionDatabaseMapper.toDomain(model) : null;
  }
}

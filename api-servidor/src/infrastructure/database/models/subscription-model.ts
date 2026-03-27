import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface SubscriptionAttributes {
  id: string;
  userId: string;
  planId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SubscriptionCreationAttributes = Optional<
  SubscriptionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class SubscriptionModel
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: string;
  public userId!: string;
  public planId!: string;
  public stripeCustomerId!: string | null;
  public stripeSubscriptionId!: string | null;
  public status!: string;
  public currentPeriodStart!: Date;
  public currentPeriodEnd!: Date;
  public cancelAtPeriodEnd!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubscriptionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'plan_id',
      references: {
        model: 'plans',
        key: 'id',
      },
    },
    stripeCustomerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stripe_customer_id',
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stripe_subscription_id',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'current_period_start',
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'current_period_end',
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'cancel_at_period_end',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    timestamps: true,
    underscored: true,
  },
);

export { SubscriptionModel, SubscriptionAttributes, SubscriptionCreationAttributes };

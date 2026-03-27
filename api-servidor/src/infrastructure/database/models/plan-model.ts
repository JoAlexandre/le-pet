import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface PlanAttributes {
  id: string;
  name: string;
  slug: string;
  tier: string;
  role: string;
  price: number;
  currency: string;
  intervalMonths: number;
  stripePriceId: string | null;
  limits: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PlanCreationAttributes = Optional<PlanAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class PlanModel extends Model<PlanAttributes, PlanCreationAttributes> implements PlanAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public tier!: string;
  public role!: string;
  public price!: number;
  public currency!: string;
  public intervalMonths!: number;
  public stripePriceId!: string | null;
  public limits!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlanModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'plans_slug_unique',
    },
    tier: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'BRL',
    },
    intervalMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'interval_months',
    },
    stripePriceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stripe_price_id',
    },
    limits: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
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
    tableName: 'plans',
    timestamps: true,
    underscored: true,
  },
);

export { PlanModel, PlanAttributes, PlanCreationAttributes };

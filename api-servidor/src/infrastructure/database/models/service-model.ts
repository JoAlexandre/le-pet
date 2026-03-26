import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ServiceAttributes {
  id: string;
  companyId: string | null;
  professionalId: string | null;
  name: string;
  description: string | null;
  category: string;
  price: number;
  durationMinutes: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type ServiceCreationAttributes = Optional<
  ServiceAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

class ServiceModel
  extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes
{
  public id!: string;
  public companyId!: string | null;
  public professionalId!: string | null;
  public name!: string;
  public description!: string | null;
  public category!: string;
  public price!: number;
  public durationMinutes!: number | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ServiceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'professional_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'duration_minutes',
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    tableName: 'services',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { ServiceModel };

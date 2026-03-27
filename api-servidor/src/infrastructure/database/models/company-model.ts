import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface CompanyAttributes {
  id: string;
  userId: string;
  tradeName: string;
  legalName: string;
  cnpj: string | null;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type CompanyCreationAttributes = Optional<CompanyAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

class CompanyModel
  extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes
{
  public id!: string;
  public userId!: string;
  public tradeName!: string;
  public legalName!: string;
  public cnpj!: string | null;
  public phone!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public description!: string | null;
  public logoUrl!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

CompanyModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'companies_user_id_unique',
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    tradeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'trade_name',
    },
    legalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'legal_name',
    },
    cnpj: {
      type: DataTypes.STRING(14),
      allowNull: true,
      unique: 'companies_cnpj_unique',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'logo_url',
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
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { CompanyModel };

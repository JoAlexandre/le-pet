import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface CompanyProfessionalAttributes {
  id: string;
  companyId: string;
  userId: string;
  createdAt: Date;
  deletedAt: Date | null;
}

type CompanyProfessionalCreationAttributes = Optional<
  CompanyProfessionalAttributes,
  'id' | 'createdAt' | 'deletedAt'
>;

class CompanyProfessionalModel
  extends Model<CompanyProfessionalAttributes, CompanyProfessionalCreationAttributes>
  implements CompanyProfessionalAttributes
{
  public id!: string;
  public companyId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date | null;
}

CompanyProfessionalModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id',
      },
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    tableName: 'company_professionals',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    paranoid: true,
  },
);

export { CompanyProfessionalModel };

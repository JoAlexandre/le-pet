import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ProductQuestionAttributes {
  id: string;
  productId: string;
  userId: string;
  question: string;
  answer: string | null;
  answeredBy: string | null;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type ProductQuestionCreationAttributes = Optional<
  ProductQuestionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class ProductQuestionModel
  extends Model<ProductQuestionAttributes, ProductQuestionCreationAttributes>
  implements ProductQuestionAttributes
{
  public id!: string;
  public productId!: string;
  public userId!: string;
  public question!: string;
  public answer!: string | null;
  public answeredBy!: string | null;
  public answeredAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductQuestionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answeredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'answered_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'answered_at',
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
    tableName: 'product_questions',
    timestamps: true,
    underscored: true,
  },
);

export { ProductQuestionModel };

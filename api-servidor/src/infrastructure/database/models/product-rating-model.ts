import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ProductRatingAttributes {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type ProductRatingCreationAttributes = Optional<
  ProductRatingAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class ProductRatingModel
  extends Model<ProductRatingAttributes, ProductRatingCreationAttributes>
  implements ProductRatingAttributes
{
  public id!: string;
  public productId!: string;
  public userId!: string;
  public rating!: number;
  public comment!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductRatingModel.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'product_ratings',
    timestamps: true,
    underscored: true,
  },
);

export { ProductRatingModel };

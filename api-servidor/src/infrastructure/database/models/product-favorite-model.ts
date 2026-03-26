import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ProductFavoriteAttributes {
  id: string;
  productId: string;
  userId: string;
  createdAt: Date;
}

type ProductFavoriteCreationAttributes = Optional<ProductFavoriteAttributes, 'id' | 'createdAt'>;

class ProductFavoriteModel
  extends Model<ProductFavoriteAttributes, ProductFavoriteCreationAttributes>
  implements ProductFavoriteAttributes
{
  public id!: string;
  public productId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
}

ProductFavoriteModel.init(
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'product_favorites',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { ProductFavoriteModel };

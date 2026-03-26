import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ProductSizeAttributes {
  id: string;
  productId: string;
  sizeType: string;
  name: string;
  price: number;
  discountPercent: number | null;
  discountExpiresAt: Date | null;
  stock: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ProductSizeCreationAttributes = Optional<
  ProductSizeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class ProductSizeModel
  extends Model<ProductSizeAttributes, ProductSizeCreationAttributes>
  implements ProductSizeAttributes
{
  public id!: string;
  public productId!: string;
  public sizeType!: string;
  public name!: string;
  public price!: number;
  public discountPercent!: number | null;
  public discountExpiresAt!: Date | null;
  public stock!: number | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductSizeModel.init(
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
    sizeType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'size_type',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'discount_percent',
    },
    discountExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'discount_expires_at',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'product_sizes',
    timestamps: true,
    underscored: true,
  },
);

export { ProductSizeModel };

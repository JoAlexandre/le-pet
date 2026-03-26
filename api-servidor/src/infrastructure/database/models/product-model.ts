import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ProductAttributes {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  category: string;
  productType: string | null;
  imageUrl: string | null;
  averageRating: number | null;
  totalRatings: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

class ProductModel
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public companyId!: string;
  public name!: string;
  public description!: string | null;
  public category!: string;
  public productType!: string | null;
  public imageUrl!: string | null;
  public averageRating!: number | null;
  public totalRatings!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ProductModel.init(
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
    productType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'product_type',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      field: 'average_rating',
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_ratings',
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
    tableName: 'products',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { ProductModel };

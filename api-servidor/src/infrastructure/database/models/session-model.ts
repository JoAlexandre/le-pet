import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface WebSessionAttributes {
  sid: string;
  userId: string | null;
  data: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type WebSessionCreationAttributes = Optional<WebSessionAttributes, 'createdAt' | 'updatedAt'>;

class WebSessionModel
  extends Model<WebSessionAttributes, WebSessionCreationAttributes>
  implements WebSessionAttributes
{
  public sid!: string;
  public userId!: string | null;
  public data!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebSessionModel.init(
  {
    sid: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
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
    tableName: 'web_sessions',
    timestamps: true,
    underscored: true,
  },
);

export { WebSessionModel };

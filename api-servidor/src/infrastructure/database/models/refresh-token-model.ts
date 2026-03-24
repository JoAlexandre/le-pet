import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface SessionModelAttributes {
  id: string;
  userId: string;
  authProvider: string | null;
  token: string;
  expiresAt: Date;
  deviceInfo: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date;
}

type SessionModelCreationAttributes = Optional<SessionModelAttributes, 'createdAt' | 'lastUsedAt'>;

class SessionModel
  extends Model<SessionModelAttributes, SessionModelCreationAttributes>
  implements SessionModelAttributes
{
  public id!: string;
  public userId!: string;
  public authProvider!: string | null;
  public token!: string;
  public expiresAt!: Date;
  public deviceInfo!: string | null;
  public ipAddress!: string | null;
  public userAgent!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public lastUsedAt!: Date;
}

SessionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    authProvider: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'auth_provider',
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    deviceInfo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'device_info',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent',
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
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'last_used_at',
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['is_active'] },
      { fields: ['expires_at'] },
      { fields: ['token'] },
    ],
  },
);

export { SessionModel };

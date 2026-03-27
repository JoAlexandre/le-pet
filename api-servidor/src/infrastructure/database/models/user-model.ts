import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: string | null;
  authProvider: string;
  providerId: string | null;
  specialtyType: string | null;
  crmvNumber: string | null;
  crmvState: string | null;
  crmvStatus: string | null;
  phone: string | null;
  isActive: boolean;
  isOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string | null;
  public role!: string | null;
  public authProvider!: string;
  public providerId!: string | null;
  public specialtyType!: string | null;
  public crmvNumber!: string | null;
  public crmvState!: string | null;
  public crmvStatus!: string | null;
  public phone!: string | null;
  public isActive!: boolean;
  public isOnboardingComplete!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: 'users_email_unique',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'TUTOR', 'COMPANY', 'PROFESSIONAL'),
      allowNull: true,
    },
    authProvider: {
      type: DataTypes.ENUM('GOOGLE', 'APPLE', 'MICROSOFT', 'EMAIL'),
      allowNull: false,
      field: 'auth_provider',
    },
    providerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'provider_id',
    },
    specialtyType: {
      type: DataTypes.ENUM('VETERINARIAN', 'GROOMER', 'BATHER', 'TRAINER', 'OTHER'),
      allowNull: true,
      field: 'specialty_type',
    },
    crmvNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'crmv_number',
    },
    crmvState: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'crmv_state',
    },
    crmvStatus: {
      type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
      allowNull: true,
      field: 'crmv_status',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    isOnboardingComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_onboarding_complete',
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { UserModel, UserAttributes, UserCreationAttributes };

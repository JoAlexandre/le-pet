import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface LostAnimalAttributes {
  id: string;
  tutorId: string;
  animalId: string | null;
  title: string;
  description: string | null;
  state: string;
  city: string;
  lastSeenLocation: string | null;
  lastSeenDate: Date | null;
  contactPhone: string | null;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type LostAnimalCreationAttributes = Optional<
  LostAnimalAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

class LostAnimalModel
  extends Model<LostAnimalAttributes, LostAnimalCreationAttributes>
  implements LostAnimalAttributes
{
  public id!: string;
  public tutorId!: string;
  public animalId!: string | null;
  public title!: string;
  public description!: string | null;
  public state!: string;
  public city!: string;
  public lastSeenLocation!: string | null;
  public lastSeenDate!: Date | null;
  public contactPhone!: string | null;
  public status!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

LostAnimalModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'tutor_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    animalId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'animal_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastSeenLocation: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'last_seen_location',
    },
    lastSeenDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_seen_date',
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'contact_phone',
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'LOST',
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
    tableName: 'lost_animals',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { LostAnimalModel };

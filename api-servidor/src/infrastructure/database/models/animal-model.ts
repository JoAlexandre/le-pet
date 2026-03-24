import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface AnimalAttributes {
  id: string;
  tutorId: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string;
  birthDate: Date | null;
  weight: number | null;
  color: string | null;
  microchipNumber: string | null;
  photoUrl: string | null;
  allergies: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type AnimalCreationAttributes = Optional<AnimalAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

class AnimalModel
  extends Model<AnimalAttributes, AnimalCreationAttributes>
  implements AnimalAttributes
{
  public id!: string;
  public tutorId!: string;
  public name!: string;
  public species!: string;
  public breed!: string | null;
  public gender!: string;
  public birthDate!: Date | null;
  public weight!: number | null;
  public color!: string | null;
  public microchipNumber!: string | null;
  public photoUrl!: string | null;
  public allergies!: string | null;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

AnimalModel.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'birth_date',
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    microchipNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'microchip_number',
    },
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'photo_url',
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    tableName: 'animals',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export { AnimalModel };

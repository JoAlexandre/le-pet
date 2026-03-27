import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface PetinderProfileAttributes {
  id: string;
  animalId: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PetinderProfileCreationAttributes = Optional<
  PetinderProfileAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class PetinderProfileModel
  extends Model<PetinderProfileAttributes, PetinderProfileCreationAttributes>
  implements PetinderProfileAttributes
{
  public id!: string;
  public animalId!: string;
  public description!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PetinderProfileModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    animalId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'petinder_profiles_animal_id_unique',
      field: 'animal_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'petinder_profiles',
    timestamps: true,
    underscored: true,
  },
);

export { PetinderProfileModel };

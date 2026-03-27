import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface PetinderMatchAttributes {
  id: string;
  animalOneId: string;
  animalTwoId: string;
  isActive: boolean;
  createdAt: Date;
}

type PetinderMatchCreationAttributes = Optional<PetinderMatchAttributes, 'id' | 'createdAt'>;

class PetinderMatchModel
  extends Model<PetinderMatchAttributes, PetinderMatchCreationAttributes>
  implements PetinderMatchAttributes
{
  public id!: string;
  public animalOneId!: string;
  public animalTwoId!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
}

PetinderMatchModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    animalOneId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'animal_one_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    animalTwoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'animal_two_id',
      references: {
        model: 'animals',
        key: 'id',
      },
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
  },
  {
    sequelize,
    tableName: 'petinder_matches',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { PetinderMatchModel };

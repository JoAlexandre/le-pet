import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface PetinderSwipeAttributes {
  id: string;
  swiperAnimalId: string;
  targetAnimalId: string;
  isLike: boolean;
  createdAt: Date;
}

type PetinderSwipeCreationAttributes = Optional<PetinderSwipeAttributes, 'id' | 'createdAt'>;

class PetinderSwipeModel
  extends Model<PetinderSwipeAttributes, PetinderSwipeCreationAttributes>
  implements PetinderSwipeAttributes
{
  public id!: string;
  public swiperAnimalId!: string;
  public targetAnimalId!: string;
  public isLike!: boolean;
  public readonly createdAt!: Date;
}

PetinderSwipeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    swiperAnimalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'swiper_animal_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    targetAnimalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'target_animal_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    isLike: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_like',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'petinder_swipes',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { PetinderSwipeModel };

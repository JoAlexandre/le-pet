import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface LostAnimalMediaAttributes {
  id: string;
  lostAnimalId: string;
  mediaType: string;
  url: string;
  displayOrder: number;
  createdAt: Date;
}

type LostAnimalMediaCreationAttributes = Optional<
  LostAnimalMediaAttributes,
  'id' | 'createdAt'
>;

class LostAnimalMediaModel
  extends Model<LostAnimalMediaAttributes, LostAnimalMediaCreationAttributes>
  implements LostAnimalMediaAttributes
{
  public id!: string;
  public lostAnimalId!: string;
  public mediaType!: string;
  public url!: string;
  public displayOrder!: number;
  public readonly createdAt!: Date;
}

LostAnimalMediaModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lostAnimalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'lost_animal_id',
      references: {
        model: 'lost_animals',
        key: 'id',
      },
    },
    mediaType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'media_type',
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'display_order',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'lost_animal_media',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { LostAnimalMediaModel };

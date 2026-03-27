import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface PetinderMessageAttributes {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

type PetinderMessageCreationAttributes = Optional<PetinderMessageAttributes, 'id' | 'createdAt'>;

class PetinderMessageModel
  extends Model<PetinderMessageAttributes, PetinderMessageCreationAttributes>
  implements PetinderMessageAttributes
{
  public id!: string;
  public matchId!: string;
  public senderId!: string;
  public content!: string;
  public readonly createdAt!: Date;
}

PetinderMessageModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'match_id',
      references: {
        model: 'petinder_matches',
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'sender_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'petinder_messages',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { PetinderMessageModel };

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface ScheduleAttributes {
  id: string;
  ownerId: string;
  ownerType: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ScheduleCreationAttributes = Optional<
  ScheduleAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class ScheduleModel
  extends Model<ScheduleAttributes, ScheduleCreationAttributes>
  implements ScheduleAttributes
{
  public id!: string;
  public ownerId!: string;
  public ownerType!: string;
  public dayOfWeek!: number;
  public startTime!: string;
  public endTime!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ScheduleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id',
    },
    ownerType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'owner_type',
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_of_week',
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'end_time',
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
    tableName: 'schedules',
    timestamps: true,
    underscored: true,
  },
);

export { ScheduleModel };

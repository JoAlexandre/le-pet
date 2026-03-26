import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface AppointmentAttributes {
  id: string;
  tutorId: string;
  animalId: string;
  professionalId: string;
  companyId: string | null;
  serviceId: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type AppointmentCreationAttributes = Optional<
  AppointmentAttributes,
  'id' | 'companyId' | 'notes' | 'cancellationReason' | 'createdAt' | 'updatedAt'
>;

class AppointmentModel
  extends Model<AppointmentAttributes, AppointmentCreationAttributes>
  implements AppointmentAttributes
{
  public id!: string;
  public tutorId!: string;
  public animalId!: string;
  public professionalId!: string;
  public companyId!: string | null;
  public serviceId!: string;
  public scheduledDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public status!: string;
  public notes!: string | null;
  public cancellationReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AppointmentModel.init(
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
      allowNull: false,
      field: 'animal_id',
      references: {
        model: 'animals',
        key: 'id',
      },
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'professional_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'service_id',
      references: {
        model: 'services',
        key: 'id',
      },
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'scheduled_date',
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_reason',
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
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
  },
);

export { AppointmentModel };

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface VaccineRecordAttributes {
  id: string;
  animalId: string;
  professionalId: string;
  vaccineName: string;
  vaccineManufacturer: string | null;
  batchNumber: string | null;
  applicationDate: Date;
  nextDoseDate: Date | null;
  notes: string | null;
  createdAt: Date;
}

type VaccineRecordCreationAttributes = Optional<VaccineRecordAttributes, 'id' | 'createdAt'>;

class VaccineRecordModel
  extends Model<VaccineRecordAttributes, VaccineRecordCreationAttributes>
  implements VaccineRecordAttributes
{
  public id!: string;
  public animalId!: string;
  public professionalId!: string;
  public vaccineName!: string;
  public vaccineManufacturer!: string | null;
  public batchNumber!: string | null;
  public applicationDate!: Date;
  public nextDoseDate!: Date | null;
  public notes!: string | null;
  public readonly createdAt!: Date;
}

VaccineRecordModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    vaccineName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'vaccine_name',
    },
    vaccineManufacturer: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'vaccine_manufacturer',
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'batch_number',
    },
    applicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'application_date',
    },
    nextDoseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'next_dose_date',
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
  },
  {
    sequelize,
    tableName: 'vaccine_records',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export { VaccineRecordModel };

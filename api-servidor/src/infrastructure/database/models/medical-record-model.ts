import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/connection';

interface MedicalRecordAttributes {
  id: string;
  animalId: string;
  professionalId: string;
  type: string;
  title: string;
  description: string | null;
  diagnosis: string | null;
  medications: string | null;
  dosage: string | null;
  treatmentNotes: string | null;
  reason: string | null;
  anamnesis: string | null;
  physicalExam: string | null;
  vitalSigns: string | null;
  validUntil: Date | null;
  consentGiven: boolean | null;
  attachmentUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type MedicalRecordCreationAttributes = Optional<
  MedicalRecordAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class MedicalRecordModel
  extends Model<MedicalRecordAttributes, MedicalRecordCreationAttributes>
  implements MedicalRecordAttributes
{
  public id!: string;
  public animalId!: string;
  public professionalId!: string;
  public type!: string;
  public title!: string;
  public description!: string | null;
  public diagnosis!: string | null;
  public medications!: string | null;
  public dosage!: string | null;
  public treatmentNotes!: string | null;
  public reason!: string | null;
  public anamnesis!: string | null;
  public physicalExam!: string | null;
  public vitalSigns!: string | null;
  public validUntil!: Date | null;
  public consentGiven!: boolean | null;
  public attachmentUrl!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MedicalRecordModel.init(
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
    type: {
      type: DataTypes.ENUM(
        'CONSULTATION',
        'CONSULTATION_RETURN',
        'CERTIFICATE_HEALTH',
        'CERTIFICATE_DEATH',
        'CERTIFICATE_VACCINE',
        'CERTIFICATE_TRANSPORT',
        'TERM_SURGERY',
        'TERM_ANESTHESIA',
        'TERM_EUTHANASIA',
        'TERM_HOSPITALIZATION',
        'PRESCRIPTION',
        'SURGICAL_REPORT',
        'EUTHANASIA_REPORT',
        'EXAM_RESULT',
        'OTHER',
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dosage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treatmentNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'treatment_notes',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    anamnesis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    physicalExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'physical_exam',
    },
    vitalSigns: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'vital_signs',
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'valid_until',
    },
    consentGiven: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'consent_given',
    },
    attachmentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'attachment_url',
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
    tableName: 'medical_records',
    timestamps: true,
    underscored: true,
  },
);

export { MedicalRecordModel };

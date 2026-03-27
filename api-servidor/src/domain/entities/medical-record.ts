import { MedicalRecordType } from '../enums/medical-record-type';

export interface MedicalRecordProps {
  id?: string;
  animalId: string;
  professionalId: string;
  type: MedicalRecordType;
  title: string;
  description?: string | null;
  diagnosis?: string | null;
  medications?: string | null;
  dosage?: string | null;
  treatmentNotes?: string | null;
  reason?: string | null;
  anamnesis?: string | null;
  physicalExam?: string | null;
  vitalSigns?: string | null;
  validUntil?: Date | null;
  consentGiven?: boolean | null;
  attachmentUrl?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MedicalRecord {
  public readonly id?: string;
  public animalId: string;
  public professionalId: string;
  public type: MedicalRecordType;
  public title: string;
  public description?: string | null;
  public diagnosis?: string | null;
  public medications?: string | null;
  public dosage?: string | null;
  public treatmentNotes?: string | null;
  public reason?: string | null;
  public anamnesis?: string | null;
  public physicalExam?: string | null;
  public vitalSigns?: string | null;
  public validUntil?: Date | null;
  public consentGiven?: boolean | null;
  public attachmentUrl?: string | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: MedicalRecordProps) {
    this.id = props.id;
    this.animalId = props.animalId;
    this.professionalId = props.professionalId;
    this.type = props.type;
    this.title = props.title;
    this.description = props.description;
    this.diagnosis = props.diagnosis;
    this.medications = props.medications;
    this.dosage = props.dosage;
    this.treatmentNotes = props.treatmentNotes;
    this.reason = props.reason;
    this.anamnesis = props.anamnesis;
    this.physicalExam = props.physicalExam;
    this.vitalSigns = props.vitalSigns;
    this.validUntil = props.validUntil;
    this.consentGiven = props.consentGiven;
    this.attachmentUrl = props.attachmentUrl;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

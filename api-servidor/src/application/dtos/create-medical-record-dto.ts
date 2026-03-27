export interface CreateMedicalRecordDto {
  type: string;
  title: string;
  description?: string;
  diagnosis?: string;
  medications?: string;
  dosage?: string;
  treatmentNotes?: string;
  reason?: string;
  anamnesis?: string;
  physicalExam?: string;
  vitalSigns?: string;
  validUntil?: string;
  consentGiven?: boolean;
}

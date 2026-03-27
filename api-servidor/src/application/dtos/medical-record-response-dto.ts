export interface MedicalRecordResponseDto {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface VaccineRecordResponseDto {
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

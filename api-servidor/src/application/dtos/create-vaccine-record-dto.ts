export interface CreateVaccineRecordDto {
  vaccineName: string;
  vaccineManufacturer?: string;
  batchNumber?: string;
  applicationDate: string;
  nextDoseDate?: string;
  notes?: string;
}

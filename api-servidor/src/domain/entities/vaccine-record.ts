export interface VaccineRecordProps {
  id?: string;
  animalId: string;
  professionalId: string;
  vaccineName: string;
  vaccineManufacturer?: string | null;
  batchNumber?: string | null;
  applicationDate: Date;
  nextDoseDate?: Date | null;
  notes?: string | null;
  createdAt?: Date;
}

export class VaccineRecord {
  public readonly id?: string;
  public animalId: string;
  public professionalId: string;
  public vaccineName: string;
  public vaccineManufacturer?: string | null;
  public batchNumber?: string | null;
  public applicationDate: Date;
  public nextDoseDate?: Date | null;
  public notes?: string | null;
  public readonly createdAt?: Date;

  constructor(props: VaccineRecordProps) {
    this.id = props.id;
    this.animalId = props.animalId;
    this.professionalId = props.professionalId;
    this.vaccineName = props.vaccineName;
    this.vaccineManufacturer = props.vaccineManufacturer;
    this.batchNumber = props.batchNumber;
    this.applicationDate = props.applicationDate;
    this.nextDoseDate = props.nextDoseDate;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
  }
}

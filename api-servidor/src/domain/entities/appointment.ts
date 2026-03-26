import { AppointmentStatus } from '../enums/appointment-status';

export interface AppointmentProps {
  id?: string;
  tutorId: string;
  animalId: string;
  professionalId: string;
  companyId?: string | null;
  serviceId: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment {
  public readonly id?: string;
  public tutorId: string;
  public animalId: string;
  public professionalId: string;
  public companyId?: string | null;
  public serviceId: string;
  public scheduledDate: Date;
  public startTime: string;
  public endTime: string;
  public status: AppointmentStatus;
  public notes?: string | null;
  public cancellationReason?: string | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.tutorId = props.tutorId;
    this.animalId = props.animalId;
    this.professionalId = props.professionalId;
    this.companyId = props.companyId;
    this.serviceId = props.serviceId;
    this.scheduledDate = props.scheduledDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.status = props.status;
    this.notes = props.notes;
    this.cancellationReason = props.cancellationReason;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

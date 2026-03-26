import { LostAnimalStatus } from '../enums/lost-animal-status';
import { LostAnimalMedia } from './lost-animal-media';

export interface LostAnimalProps {
  id?: string;
  tutorId: string;
  animalId?: string | null;
  title: string;
  description?: string | null;
  state: string;
  city: string;
  lastSeenLocation?: string | null;
  lastSeenDate?: Date | null;
  contactPhone?: string | null;
  status: LostAnimalStatus;
  isActive: boolean;
  media?: LostAnimalMedia[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class LostAnimal {
  public readonly id?: string;
  public tutorId: string;
  public animalId?: string | null;
  public title: string;
  public description?: string | null;
  public state: string;
  public city: string;
  public lastSeenLocation?: string | null;
  public lastSeenDate?: Date | null;
  public contactPhone?: string | null;
  public status: LostAnimalStatus;
  public isActive: boolean;
  public media?: LostAnimalMedia[];
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: LostAnimalProps) {
    this.id = props.id;
    this.tutorId = props.tutorId;
    this.animalId = props.animalId;
    this.title = props.title;
    this.description = props.description;
    this.state = props.state;
    this.city = props.city;
    this.lastSeenLocation = props.lastSeenLocation;
    this.lastSeenDate = props.lastSeenDate;
    this.contactPhone = props.contactPhone;
    this.status = props.status;
    this.isActive = props.isActive;
    this.media = props.media;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}

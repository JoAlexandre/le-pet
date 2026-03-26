import { LostAnimalMediaType } from '../enums/lost-animal-media-type';

export interface LostAnimalMediaProps {
  id?: string;
  lostAnimalId: string;
  mediaType: LostAnimalMediaType;
  url: string;
  displayOrder: number;
  createdAt?: Date;
}

export class LostAnimalMedia {
  public readonly id?: string;
  public lostAnimalId: string;
  public mediaType: LostAnimalMediaType;
  public url: string;
  public displayOrder: number;
  public readonly createdAt?: Date;

  constructor(props: LostAnimalMediaProps) {
    this.id = props.id;
    this.lostAnimalId = props.lostAnimalId;
    this.mediaType = props.mediaType;
    this.url = props.url;
    this.displayOrder = props.displayOrder;
    this.createdAt = props.createdAt;
  }
}

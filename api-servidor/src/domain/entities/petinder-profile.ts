export interface PetinderProfileProps {
  id?: string;
  animalId: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PetinderProfile {
  public readonly id?: string;
  public animalId: string;
  public description?: string | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: PetinderProfileProps) {
    this.id = props.id;
    this.animalId = props.animalId;
    this.description = props.description;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

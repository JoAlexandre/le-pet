export interface PetinderMatchProps {
  id?: string;
  animalOneId: string;
  animalTwoId: string;
  isActive: boolean;
  createdAt?: Date;
}

export class PetinderMatch {
  public readonly id?: string;
  public animalOneId: string;
  public animalTwoId: string;
  public isActive: boolean;
  public readonly createdAt?: Date;

  constructor(props: PetinderMatchProps) {
    this.id = props.id;
    this.animalOneId = props.animalOneId;
    this.animalTwoId = props.animalTwoId;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
  }
}

export interface PetinderSwipeProps {
  id?: string;
  swiperAnimalId: string;
  targetAnimalId: string;
  isLike: boolean;
  createdAt?: Date;
}

export class PetinderSwipe {
  public readonly id?: string;
  public swiperAnimalId: string;
  public targetAnimalId: string;
  public isLike: boolean;
  public readonly createdAt?: Date;

  constructor(props: PetinderSwipeProps) {
    this.id = props.id;
    this.swiperAnimalId = props.swiperAnimalId;
    this.targetAnimalId = props.targetAnimalId;
    this.isLike = props.isLike;
    this.createdAt = props.createdAt;
  }
}

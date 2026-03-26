export interface ProductRatingProps {
  id?: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductRating {
  public readonly id?: string;
  public productId: string;
  public userId: string;
  public rating: number;
  public comment?: string | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ProductRatingProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.userId = props.userId;
    this.rating = props.rating;
    this.comment = props.comment;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

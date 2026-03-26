export interface ProductFavoriteProps {
  id?: string;
  productId: string;
  userId: string;
  createdAt?: Date;
}

export class ProductFavorite {
  public readonly id?: string;
  public productId: string;
  public userId: string;
  public readonly createdAt?: Date;

  constructor(props: ProductFavoriteProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
  }
}

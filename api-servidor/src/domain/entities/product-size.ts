import { SizeType } from '../enums/size-type';

export interface ProductSizeProps {
  id?: string;
  productId: string;
  sizeType: SizeType;
  name: string;
  price: number;
  discountPercent?: number | null;
  discountExpiresAt?: Date | null;
  stock?: number | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductSize {
  public readonly id?: string;
  public productId: string;
  public sizeType: SizeType;
  public name: string;
  public price: number;
  public discountPercent?: number | null;
  public discountExpiresAt?: Date | null;
  public stock?: number | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ProductSizeProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.sizeType = props.sizeType;
    this.name = props.name;
    this.price = props.price;
    this.discountPercent = props.discountPercent;
    this.discountExpiresAt = props.discountExpiresAt;
    this.stock = props.stock;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

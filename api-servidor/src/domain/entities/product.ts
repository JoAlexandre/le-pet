import { ProductCategory } from '../enums/product-category';
import { ProductType } from '../enums/product-type';

export interface ProductProps {
  id?: string;
  companyId: string;
  name: string;
  description?: string | null;
  category: ProductCategory;
  productType?: ProductType | null;
  imageUrl?: string | null;
  averageRating?: number | null;
  totalRatings?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Product {
  public readonly id?: string;
  public companyId: string;
  public name: string;
  public description?: string | null;
  public category: ProductCategory;
  public productType?: ProductType | null;
  public imageUrl?: string | null;
  public averageRating?: number | null;
  public totalRatings: number;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.productType = props.productType;
    this.imageUrl = props.imageUrl;
    this.averageRating = props.averageRating;
    this.totalRatings = props.totalRatings ?? 0;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}

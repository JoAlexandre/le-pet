export interface CreateProductSizeDto {
  sizeType: string;
  name: string;
  price: number;
  discountPercent?: number;
  discountExpiresAt?: string;
  stock?: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  productType?: string;
  imageUrl?: string;
  sizes?: CreateProductSizeDto[];
}

export interface ProductSizeResponseDto {
  id: string;
  sizeType: string;
  name: string;
  price: number;
  discountPercent: number | null;
  discountExpiresAt: Date | null;
  effectivePrice: number;
  stock: number | null;
  isActive: boolean;
}

export interface ProductQuestionResponseDto {
  id: string;
  userId: string;
  question: string;
  answer: string | null;
  answeredAt: Date | null;
  createdAt: Date;
}

export interface ProductRatingResponseDto {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface ProductResponseDto {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  category: string;
  productType: string | null;
  imageUrl: string | null;
  averageRating: number | null;
  totalRatings: number;
  isFavorite: boolean;
  isActive: boolean;
  sizes: ProductSizeResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

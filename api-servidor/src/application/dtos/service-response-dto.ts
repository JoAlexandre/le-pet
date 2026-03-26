export interface ServiceResponseDto {
  id: string;
  companyId: string | null;
  professionalId: string | null;
  name: string;
  description: string | null;
  category: string;
  price: number;
  durationMinutes: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

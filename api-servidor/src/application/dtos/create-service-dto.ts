export interface CreateServiceDto {
  name: string;
  description?: string;
  category: string;
  price: number;
  durationMinutes?: number;
}

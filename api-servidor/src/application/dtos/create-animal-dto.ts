export interface CreateAnimalDto {
  name: string;
  species: string;
  breed?: string;
  gender: string;
  birthDate?: string;
  weight?: number;
  color?: string;
  microchipNumber?: string;
  photoUrl?: string;
  allergies?: string;
  notes?: string;
}

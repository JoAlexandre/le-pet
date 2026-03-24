export interface AnimalResponseDto {
  id: string;
  tutorId: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string;
  birthDate: Date | null;
  weight: number | null;
  color: string | null;
  microchipNumber: string | null;
  photoUrl: string | null;
  allergies: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

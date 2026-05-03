export interface UpdateAnimalDto {
  name?: string;
  species?: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  weight?: number;
  color?: string;
  microchipNumber?: string;
  photoUrl?: string;
  photoBuffer?: Buffer;
  photoMimeType?: string;
  photoOriginalName?: string;
  allergies?: string;
  notes?: string;
}

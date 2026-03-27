export interface PetinderProfileResponseDto {
  id: string;
  animalId: string;
  animalName: string;
  species: string;
  breed: string | null;
  gender: string;
  photoUrl: string | null;
  description: string | null;
  isActive: boolean;
  hasLikedYou?: boolean;
  createdAt: Date;
}

export interface LostAnimalMediaResponseDto {
  id: string;
  mediaType: string;
  url: string;
  displayOrder: number;
}

export interface LostAnimalResponseDto {
  id: string;
  tutorId: string;
  animalId: string | null;
  title: string;
  description: string | null;
  state: string;
  city: string;
  lastSeenLocation: string | null;
  lastSeenDate: Date | null;
  contactPhone: string | null;
  status: string;
  media: LostAnimalMediaResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

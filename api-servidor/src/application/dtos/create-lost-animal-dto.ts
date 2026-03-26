export interface LostAnimalMediaDto {
  mediaType: string;
  url: string;
  displayOrder: number;
}

export interface CreateLostAnimalDto {
  animalId?: string;
  title: string;
  description?: string;
  state: string;
  city: string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  contactPhone?: string;
  media?: LostAnimalMediaDto[];
}

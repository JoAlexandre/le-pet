import { LostAnimal } from '../../../domain/entities/lost-animal';
import {
  LostAnimalResponseDto,
  LostAnimalMediaResponseDto,
} from '../../../application/dtos/lost-animal-response-dto';

export class LostAnimalMapper {
  static toResponse(lostAnimal: LostAnimal): LostAnimalResponseDto {
    const media: LostAnimalMediaResponseDto[] = (lostAnimal.media || []).map((m) => ({
      id: m.id!,
      mediaType: m.mediaType,
      url: m.url,
      displayOrder: m.displayOrder,
    }));

    return {
      id: lostAnimal.id!,
      tutorId: lostAnimal.tutorId,
      animalId: lostAnimal.animalId || null,
      title: lostAnimal.title,
      description: lostAnimal.description || null,
      state: lostAnimal.state,
      city: lostAnimal.city,
      lastSeenLocation: lostAnimal.lastSeenLocation || null,
      lastSeenDate: lostAnimal.lastSeenDate || null,
      contactPhone: lostAnimal.contactPhone || null,
      status: lostAnimal.status,
      media,
      createdAt: lostAnimal.createdAt!,
      updatedAt: lostAnimal.updatedAt!,
    };
  }
}

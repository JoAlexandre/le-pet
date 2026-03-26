import { LostAnimal } from '../../../domain/entities/lost-animal';
import { LostAnimalStatus } from '../../../domain/enums/lost-animal-status';
import { LostAnimalModel } from '../models/lost-animal-model';

export class LostAnimalDatabaseMapper {
  static toDomain(model: LostAnimalModel): LostAnimal {
    return new LostAnimal({
      id: model.id,
      tutorId: model.tutorId,
      animalId: model.animalId,
      title: model.title,
      description: model.description,
      state: model.state,
      city: model.city,
      lastSeenLocation: model.lastSeenLocation,
      lastSeenDate: model.lastSeenDate ? new Date(model.lastSeenDate) : null,
      contactPhone: model.contactPhone,
      status: model.status as LostAnimalStatus,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: LostAnimal): Partial<LostAnimalModel> {
    return {
      id: entity.id,
      tutorId: entity.tutorId,
      animalId: entity.animalId ?? null,
      title: entity.title,
      description: entity.description ?? null,
      state: entity.state,
      city: entity.city,
      lastSeenLocation: entity.lastSeenLocation ?? null,
      lastSeenDate: entity.lastSeenDate ?? null,
      contactPhone: entity.contactPhone ?? null,
      status: entity.status,
      isActive: entity.isActive,
    };
  }
}

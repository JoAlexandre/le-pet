import { LostAnimalMedia } from '../../../domain/entities/lost-animal-media';
import { LostAnimalMediaType } from '../../../domain/enums/lost-animal-media-type';
import { LostAnimalMediaModel } from '../models/lost-animal-media-model';

export class LostAnimalMediaDatabaseMapper {
  static toDomain(model: LostAnimalMediaModel): LostAnimalMedia {
    return new LostAnimalMedia({
      id: model.id,
      lostAnimalId: model.lostAnimalId,
      mediaType: model.mediaType as LostAnimalMediaType,
      url: model.url,
      displayOrder: model.displayOrder,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: LostAnimalMedia): Partial<LostAnimalMediaModel> {
    return {
      id: entity.id,
      lostAnimalId: entity.lostAnimalId,
      mediaType: entity.mediaType,
      url: entity.url,
      displayOrder: entity.displayOrder,
    };
  }
}

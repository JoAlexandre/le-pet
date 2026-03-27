import { PetinderMessage } from '../../../domain/entities/petinder-message';
import { PetinderMessageModel } from '../models/petinder-message-model';

export class PetinderMessageDatabaseMapper {
  static toDomain(model: PetinderMessageModel): PetinderMessage {
    return new PetinderMessage({
      id: model.id,
      matchId: model.matchId,
      senderId: model.senderId,
      content: model.content,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: PetinderMessage): Partial<PetinderMessageModel> {
    return {
      id: entity.id,
      matchId: entity.matchId,
      senderId: entity.senderId,
      content: entity.content,
    };
  }
}

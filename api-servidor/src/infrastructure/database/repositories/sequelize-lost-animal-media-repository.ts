import { LostAnimalMedia } from '../../../domain/entities/lost-animal-media';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { LostAnimalMediaModel } from '../models/lost-animal-media-model';
import { LostAnimalMediaDatabaseMapper } from '../mappers/lost-animal-media-database-mapper';

export class SequelizeLostAnimalMediaRepository implements LostAnimalMediaRepository {
  async findByLostAnimalId(lostAnimalId: string): Promise<LostAnimalMedia[]> {
    const models = await LostAnimalMediaModel.findAll({
      where: { lostAnimalId },
      order: [['displayOrder', 'ASC']],
    });
    return models.map((m) => LostAnimalMediaDatabaseMapper.toDomain(m));
  }

  async bulkCreate(media: LostAnimalMedia[]): Promise<LostAnimalMedia[]> {
    const data = media.map((m) => LostAnimalMediaDatabaseMapper.toModel(m));
    const models = await LostAnimalMediaModel.bulkCreate(
      data as LostAnimalMediaModel[],
    );
    return models.map((m) => LostAnimalMediaDatabaseMapper.toDomain(m));
  }

  async deleteByLostAnimalId(lostAnimalId: string): Promise<void> {
    await LostAnimalMediaModel.destroy({ where: { lostAnimalId } });
  }
}

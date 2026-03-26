import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { DomainError } from '../../../shared/errors';

export class DeleteLostAnimalUseCase {
  constructor(
    private lostAnimalRepository: LostAnimalRepository,
    private lostAnimalMediaRepository: LostAnimalMediaRepository,
  ) {}

  async execute(id: string, tutorId: string): Promise<void> {
    const lostAnimal = await this.lostAnimalRepository.findById(id);
    if (!lostAnimal) {
      throw new DomainError('Lost animal post not found', 404);
    }

    if (lostAnimal.tutorId !== tutorId) {
      throw new DomainError('Access denied: you are not the owner of this post', 403);
    }

    await this.lostAnimalMediaRepository.deleteByLostAnimalId(id);
    await this.lostAnimalRepository.softDelete(id);
  }
}

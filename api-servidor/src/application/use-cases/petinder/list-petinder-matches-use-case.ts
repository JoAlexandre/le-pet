import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderMatchRepository } from '../../../domain/repositories/petinder-match-repository';
import { PetinderMatchResponseDto } from '../../dtos/petinder-match-response-dto';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListPetinderMatchesUseCase {
  constructor(
    private petinderMatchRepository: PetinderMatchRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    tutorId: string,
    animalId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PetinderMatchResponseDto>> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('You can only view matches for your own animals', 403);
    }

    const { rows, count } = await this.petinderMatchRepository.findByAnimalId(
      animalId,
      page,
      limit,
    );

    const data: PetinderMatchResponseDto[] = [];
    for (const match of rows) {
      const animalOne = await this.animalRepository.findById(match.animalOneId);
      const animalTwo = await this.animalRepository.findById(match.animalTwoId);
      data.push({
        id: match.id!,
        animalOneId: match.animalOneId,
        animalTwoId: match.animalTwoId,
        animalOneName: animalOne?.name || 'Unknown',
        animalTwoName: animalTwo?.name || 'Unknown',
        isActive: match.isActive,
        createdAt: match.createdAt!,
      });
    }

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

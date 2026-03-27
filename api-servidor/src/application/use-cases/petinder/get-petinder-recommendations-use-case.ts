import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { PetinderSwipeRepository } from '../../../domain/repositories/petinder-swipe-repository';
import { PetinderProfileResponseDto } from '../../dtos/petinder-profile-response-dto';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

// Indica se o animal alvo ja deu like no animal do tutor

export class GetPetinderRecommendationsUseCase {
  constructor(
    private petinderProfileRepository: PetinderProfileRepository,
    private petinderSwipeRepository: PetinderSwipeRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    tutorId: string,
    animalId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PetinderProfileResponseDto>> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('You can only get recommendations for your own animals', 403);
    }

    const profile = await this.petinderProfileRepository.findByAnimalId(animalId);
    if (!profile || !profile.isActive) {
      throw new DomainError('PeTinder is not enabled for this animal', 400);
    }

    // Buscar IDs dos animais ja avaliados pelo swiper
    const swipedIds = await this.petinderSwipeRepository.findSwipedAnimalIds(animalId);

    // Buscar animais do mesmo tutor para excluir
    const tutorAnimals = await this.animalRepository.findByTutorId(tutorId, 1, 1000);
    const tutorAnimalIds = tutorAnimals.rows.map((a) => a.id!);

    // Excluir o proprio animal, animais ja avaliados e animais do mesmo tutor
    const excludeIds = [...new Set([animalId, ...swipedIds, ...tutorAnimalIds])];

    const { rows: profiles, count } =
      await this.petinderProfileRepository.findActiveBySpecies(
        animal.species,
        excludeIds,
        page,
        limit,
      );

    const data: PetinderProfileResponseDto[] = [];
    for (const prof of profiles) {
      const profAnimal = await this.animalRepository.findById(prof.animalId);
      if (profAnimal) {
        // Verificar se o animal alvo ja deu like no animal do tutor
        const reverseSwipe = await this.petinderSwipeRepository.findByPair(
          prof.animalId,
          animalId,
        );
        const hasLikedYou = reverseSwipe ? reverseSwipe.isLike : false;

        data.push({
          id: prof.id!,
          animalId: profAnimal.id!,
          animalName: profAnimal.name,
          species: profAnimal.species,
          breed: profAnimal.breed || null,
          gender: profAnimal.gender,
          photoUrl: profAnimal.photoUrl || null,
          description: prof.description || null,
          isActive: prof.isActive,
          hasLikedYou,
          createdAt: prof.createdAt!,
        });
      }
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

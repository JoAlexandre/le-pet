import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { PetinderSwipeRepository } from '../../../domain/repositories/petinder-swipe-repository';
import { PetinderMatchRepository } from '../../../domain/repositories/petinder-match-repository';
import { PetinderSwipe } from '../../../domain/entities/petinder-swipe';
import { PetinderMatch } from '../../../domain/entities/petinder-match';
import { SwipePetinderDto } from '../../dtos/swipe-petinder-dto';
import { SwipePetinderResponseDto } from '../../dtos/swipe-petinder-response-dto';
import { DomainError } from '../../../shared/errors';

export class SwipePetinderUseCase {
  constructor(
    private petinderSwipeRepository: PetinderSwipeRepository,
    private petinderMatchRepository: PetinderMatchRepository,
    private petinderProfileRepository: PetinderProfileRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(tutorId: string, dto: SwipePetinderDto): Promise<SwipePetinderResponseDto> {
    // Validar animal do swiper
    const swiperAnimal = await this.animalRepository.findById(dto.swiperAnimalId);
    if (!swiperAnimal) {
      throw new DomainError('Swiper animal not found', 404);
    }

    if (swiperAnimal.tutorId !== tutorId) {
      throw new DomainError('You can only swipe with your own animals', 403);
    }

    // Validar perfil PeTinder ativo do swiper
    const swiperProfile = await this.petinderProfileRepository.findByAnimalId(
      dto.swiperAnimalId,
    );
    if (!swiperProfile || !swiperProfile.isActive) {
      throw new DomainError('PeTinder is not enabled for your animal', 400);
    }

    // Validar animal alvo
    const targetAnimal = await this.animalRepository.findById(dto.targetAnimalId);
    if (!targetAnimal) {
      throw new DomainError('Target animal not found', 404);
    }

    // Validar perfil PeTinder ativo do alvo
    const targetProfile = await this.petinderProfileRepository.findByAnimalId(
      dto.targetAnimalId,
    );
    if (!targetProfile || !targetProfile.isActive) {
      throw new DomainError('Target animal is not available on PeTinder', 400);
    }

    // Nao pode dar swipe no proprio animal
    if (dto.swiperAnimalId === dto.targetAnimalId) {
      throw new DomainError('Cannot swipe on your own animal', 400);
    }

    // Verificar mesma especie
    if (swiperAnimal.species !== targetAnimal.species) {
      throw new DomainError('Animals must be of the same species', 400);
    }

    // Verificar se ja deu swipe
    const existingSwipe = await this.petinderSwipeRepository.findByPair(
      dto.swiperAnimalId,
      dto.targetAnimalId,
    );
    if (existingSwipe) {
      throw new DomainError('You have already swiped on this animal', 409);
    }

    // Criar swipe
    const swipe = new PetinderSwipe({
      swiperAnimalId: dto.swiperAnimalId,
      targetAnimalId: dto.targetAnimalId,
      isLike: dto.isLike,
    });

    const createdSwipe = await this.petinderSwipeRepository.create(swipe);

    // Verificar match mutuo se foi like
    let isMatch = false;
    let matchId: string | null = null;

    if (dto.isLike) {
      const reverseSwipe = await this.petinderSwipeRepository.findByPair(
        dto.targetAnimalId,
        dto.swiperAnimalId,
      );

      if (reverseSwipe && reverseSwipe.isLike) {
        // Match mutuo - verificar se ja nao existe match
        const existingMatch = await this.petinderMatchRepository.findByAnimalIds(
          dto.swiperAnimalId,
          dto.targetAnimalId,
        );

        if (!existingMatch) {
          const match = new PetinderMatch({
            animalOneId: dto.swiperAnimalId,
            animalTwoId: dto.targetAnimalId,
            isActive: true,
          });

          const createdMatch = await this.petinderMatchRepository.create(match);
          isMatch = true;
          matchId = createdMatch.id!;
        }
      }
    }

    return {
      swipeId: createdSwipe.id!,
      isLike: createdSwipe.isLike,
      isMatch,
      matchId,
    };
  }
}

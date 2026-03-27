import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { Animal } from '../../../domain/entities/animal';
import { AnimalSpecies } from '../../../domain/enums/animal-species';
import { AnimalGender } from '../../../domain/enums/animal-gender';
import { Role } from '../../../domain/enums/role';
import { CreateAnimalDto } from '../../dtos/create-animal-dto';
import { AnimalResponseDto } from '../../dtos/animal-response-dto';
import { AnimalMapper } from '../../../infrastructure/http/mappers/animal-mapper';
import { DomainError } from '../../../shared/errors';
import { QuotaService } from '../../../domain/services/quota-service';

export class CreateAnimalUseCase {
  constructor(
    private animalRepository: AnimalRepository,
    private quotaService: QuotaService,
  ) {}

  async execute(
    tutorId: string,
    userRole: string,
    dto: CreateAnimalDto,
  ): Promise<AnimalResponseDto> {
    if (!Object.values(AnimalSpecies).includes(dto.species as AnimalSpecies)) {
      throw new DomainError(
        `Invalid species. Must be one of: ${Object.values(AnimalSpecies).join(', ')}`,
        400,
      );
    }

    if (!Object.values(AnimalGender).includes(dto.gender as AnimalGender)) {
      throw new DomainError(
        `Invalid gender. Must be one of: ${Object.values(AnimalGender).join(', ')}`,
        400,
      );
    }

    // Verificacao de quota de animais pelo plano do usuario
    const currentCount = await this.animalRepository.countByTutorId(tutorId);
    await this.quotaService.checkQuota(tutorId, userRole as Role, 'maxAnimals', currentCount);

    let parsedBirthDate: Date | null = null;
    if (dto.birthDate) {
      parsedBirthDate = new Date(dto.birthDate);
      if (isNaN(parsedBirthDate.getTime())) {
        throw new DomainError('Invalid birth date format', 400);
      }
    }

    const animal = new Animal({
      tutorId,
      name: dto.name,
      species: dto.species as AnimalSpecies,
      breed: dto.breed || null,
      gender: dto.gender as AnimalGender,
      birthDate: parsedBirthDate,
      weight: dto.weight ?? null,
      color: dto.color || null,
      microchipNumber: dto.microchipNumber || null,
      photoUrl: dto.photoUrl || null,
      allergies: dto.allergies || null,
      notes: dto.notes || null,
    });

    const created = await this.animalRepository.create(animal);
    return AnimalMapper.toResponse(created);
  }
}

import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { Animal } from '../../../domain/entities/animal';
import { AnimalSpecies } from '../../../domain/enums/animal-species';
import { AnimalGender } from '../../../domain/enums/animal-gender';
import { CreateAnimalDto } from '../../dtos/create-animal-dto';
import { AnimalResponseDto } from '../../dtos/animal-response-dto';
import { AnimalMapper } from '../../../infrastructure/http/mappers/animal-mapper';
import { DomainError } from '../../../shared/errors';

const MAX_ANIMALS_PER_TUTOR = 50;

export class CreateAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(tutorId: string, dto: CreateAnimalDto): Promise<AnimalResponseDto> {
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

    // Validacao basica de limite de animais no MVP
    const currentCount = await this.animalRepository.countByTutorId(tutorId);
    if (currentCount >= MAX_ANIMALS_PER_TUTOR) {
      throw new DomainError('Animal limit exceeded for your current plan', 403);
    }

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

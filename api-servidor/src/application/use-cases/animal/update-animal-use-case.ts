import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { AnimalSpecies } from '../../../domain/enums/animal-species';
import { AnimalGender } from '../../../domain/enums/animal-gender';
import { UpdateAnimalDto } from '../../dtos/update-animal-dto';
import { AnimalResponseDto } from '../../dtos/animal-response-dto';
import { AnimalMapper } from '../../../infrastructure/http/mappers/animal-mapper';
import { DomainError } from '../../../shared/errors';
import { FileStorageProvider } from '../../interfaces/file-storage-provider';

export class UpdateAnimalUseCase {
  constructor(
    private animalRepository: AnimalRepository,
    private fileStorageProvider: FileStorageProvider,
  ) {}

  async execute(
    animalId: string,
    tutorId: string,
    dto: UpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('Access denied: you are not the owner of this animal', 403);
    }

    if (dto.species !== undefined) {
      if (!Object.values(AnimalSpecies).includes(dto.species as AnimalSpecies)) {
        throw new DomainError(
          `Invalid species. Must be one of: ${Object.values(AnimalSpecies).join(', ')}`,
          400,
        );
      }
      animal.species = dto.species as AnimalSpecies;
    }

    if (dto.gender !== undefined) {
      if (!Object.values(AnimalGender).includes(dto.gender as AnimalGender)) {
        throw new DomainError(
          `Invalid gender. Must be one of: ${Object.values(AnimalGender).join(', ')}`,
          400,
        );
      }
      animal.gender = dto.gender as AnimalGender;
    }

    if (dto.name !== undefined) {
      animal.name = dto.name;
    }
    if (dto.breed !== undefined) {
      animal.breed = dto.breed || null;
    }
    if (dto.birthDate !== undefined) {
      if (dto.birthDate) {
        const parsed = new Date(dto.birthDate);
        if (isNaN(parsed.getTime())) {
          throw new DomainError('Invalid birth date format', 400);
        }
        animal.birthDate = parsed;
      } else {
        animal.birthDate = null;
      }
    }
    if (dto.weight !== undefined) {
      animal.weight = dto.weight ?? null;
    }
    if (dto.color !== undefined) {
      animal.color = dto.color || null;
    }
    if (dto.microchipNumber !== undefined) {
      animal.microchipNumber = dto.microchipNumber || null;
    }
    if (dto.photoBuffer && dto.photoMimeType) {
      if (animal.photoUrl) {
        await this.fileStorageProvider.delete(animal.photoUrl);
      }
      const uploaded = await this.fileStorageProvider.upload(
        dto.photoBuffer,
        dto.photoOriginalName ?? 'animal-photo',
        dto.photoMimeType,
      );
      animal.photoUrl = uploaded.url;
    } else if (dto.photoUrl !== undefined) {
      animal.photoUrl = dto.photoUrl || null;
    }
    if (dto.allergies !== undefined) {
      animal.allergies = dto.allergies || null;
    }
    if (dto.notes !== undefined) {
      animal.notes = dto.notes || null;
    }

    const updated = await this.animalRepository.update(animal);
    return AnimalMapper.toResponse(updated);
  }
}

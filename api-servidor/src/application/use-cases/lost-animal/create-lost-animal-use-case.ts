import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { LostAnimal } from '../../../domain/entities/lost-animal';
import { LostAnimalMedia } from '../../../domain/entities/lost-animal-media';
import { LostAnimalStatus } from '../../../domain/enums/lost-animal-status';
import { LostAnimalMediaType } from '../../../domain/enums/lost-animal-media-type';
import { Role } from '../../../domain/enums/role';
import { CreateLostAnimalDto } from '../../dtos/create-lost-animal-dto';
import { LostAnimalResponseDto } from '../../dtos/lost-animal-response-dto';
import { LostAnimalMapper } from '../../../infrastructure/http/mappers/lost-animal-mapper';
import { DomainError } from '../../../shared/errors';
import { QuotaService } from '../../../domain/services/quota-service';

export class CreateLostAnimalUseCase {
  constructor(
    private lostAnimalRepository: LostAnimalRepository,
    private lostAnimalMediaRepository: LostAnimalMediaRepository,
    private animalRepository: AnimalRepository,
    private quotaService: QuotaService,
  ) {}

  async execute(
    tutorId: string,
    userRole: string,
    dto: CreateLostAnimalDto,
  ): Promise<LostAnimalResponseDto> {
    // Verificacao de quota de posts de animais perdidos pelo plano do usuario
    const activeCount = (await this.lostAnimalRepository.findByTutorId(tutorId, 1, 1)).count;
    await this.quotaService.checkQuota(
      tutorId,
      userRole as Role,
      'maxLostAnimalPosts',
      activeCount,
    );

    // Validar animal vinculado (se informado)
    if (dto.animalId) {
      const animal = await this.animalRepository.findById(dto.animalId);
      if (!animal) {
        throw new DomainError('Animal not found', 404);
      }
      if (animal.tutorId !== tutorId) {
        throw new DomainError('Access denied: you are not the owner of this animal', 403);
      }
    }

    // Validar midia (maximo 2 fotos + 1 video)
    if (dto.media && dto.media.length > 0) {
      const photos = dto.media.filter((m) => m.mediaType === LostAnimalMediaType.PHOTO);
      const videos = dto.media.filter((m) => m.mediaType === LostAnimalMediaType.VIDEO);

      if (photos.length > 2) {
        throw new DomainError('Maximum of 2 photos per lost animal post', 400);
      }
      if (videos.length > 1) {
        throw new DomainError('Maximum of 1 video per lost animal post', 400);
      }

      for (const m of dto.media) {
        if (!Object.values(LostAnimalMediaType).includes(m.mediaType as LostAnimalMediaType)) {
          throw new DomainError(
            `Invalid media type. Must be one of: ${Object.values(LostAnimalMediaType).join(', ')}`,
            400,
          );
        }
      }
    }

    let parsedLastSeenDate: Date | null = null;
    if (dto.lastSeenDate) {
      parsedLastSeenDate = new Date(dto.lastSeenDate);
      if (isNaN(parsedLastSeenDate.getTime())) {
        throw new DomainError('Invalid last seen date format', 400);
      }
    }

    const lostAnimal = new LostAnimal({
      tutorId,
      animalId: dto.animalId || null,
      title: dto.title,
      description: dto.description || null,
      state: dto.state,
      city: dto.city,
      lastSeenLocation: dto.lastSeenLocation || null,
      lastSeenDate: parsedLastSeenDate,
      contactPhone: dto.contactPhone || null,
      status: LostAnimalStatus.LOST,
      isActive: true,
    });

    const created = await this.lostAnimalRepository.create(lostAnimal);

    // Criar midias associadas
    let media: LostAnimalMedia[] = [];
    if (dto.media && dto.media.length > 0) {
      const mediaEntities = dto.media.map(
        (m) =>
          new LostAnimalMedia({
            lostAnimalId: created.id!,
            mediaType: m.mediaType as LostAnimalMediaType,
            url: m.url,
            displayOrder: m.displayOrder,
          }),
      );
      media = await this.lostAnimalMediaRepository.bulkCreate(mediaEntities);
    }

    created.media = media;
    return LostAnimalMapper.toResponse(created);
  }
}

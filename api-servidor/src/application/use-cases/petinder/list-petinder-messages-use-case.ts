import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderMatchRepository } from '../../../domain/repositories/petinder-match-repository';
import { PetinderMessageRepository } from '../../../domain/repositories/petinder-message-repository';
import { PetinderMessageResponseDto } from '../../dtos/petinder-message-response-dto';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListPetinderMessagesUseCase {
  constructor(
    private petinderMessageRepository: PetinderMessageRepository,
    private petinderMatchRepository: PetinderMatchRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    userId: string,
    matchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PetinderMessageResponseDto>> {
    const match = await this.petinderMatchRepository.findById(matchId);
    if (!match) {
      throw new DomainError('Match not found', 404);
    }

    // Verificar se o usuario eh participante do match
    const animalOne = await this.animalRepository.findById(match.animalOneId);
    const animalTwo = await this.animalRepository.findById(match.animalTwoId);

    const isParticipant =
      animalOne?.tutorId === userId || animalTwo?.tutorId === userId;

    if (!isParticipant) {
      throw new DomainError('You are not a participant of this match', 403);
    }

    const { rows, count } = await this.petinderMessageRepository.findByMatchId(
      matchId,
      page,
      limit,
    );

    const data: PetinderMessageResponseDto[] = rows.map((msg) => ({
      id: msg.id!,
      matchId: msg.matchId,
      senderId: msg.senderId,
      content: msg.content,
      createdAt: msg.createdAt!,
    }));

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

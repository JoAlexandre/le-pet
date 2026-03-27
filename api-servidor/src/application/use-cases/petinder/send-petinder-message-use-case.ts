import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderMatchRepository } from '../../../domain/repositories/petinder-match-repository';
import { PetinderMessageRepository } from '../../../domain/repositories/petinder-message-repository';
import { PetinderMessage } from '../../../domain/entities/petinder-message';
import { SendPetinderMessageDto } from '../../dtos/send-petinder-message-dto';
import { PetinderMessageResponseDto } from '../../dtos/petinder-message-response-dto';
import { DomainError } from '../../../shared/errors';

export class SendPetinderMessageUseCase {
  constructor(
    private petinderMessageRepository: PetinderMessageRepository,
    private petinderMatchRepository: PetinderMatchRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    senderId: string,
    matchId: string,
    dto: SendPetinderMessageDto,
  ): Promise<PetinderMessageResponseDto> {
    const match = await this.petinderMatchRepository.findById(matchId);
    if (!match) {
      throw new DomainError('Match not found', 404);
    }

    if (!match.isActive) {
      throw new DomainError('This match is no longer active', 400);
    }

    // Verificar se o remetente eh dono de um dos animais do match
    const animalOne = await this.animalRepository.findById(match.animalOneId);
    const animalTwo = await this.animalRepository.findById(match.animalTwoId);

    const isParticipant =
      animalOne?.tutorId === senderId || animalTwo?.tutorId === senderId;

    if (!isParticipant) {
      throw new DomainError('You are not a participant of this match', 403);
    }

    if (!dto.content || dto.content.trim().length === 0) {
      throw new DomainError('Message content cannot be empty', 400);
    }

    const message = new PetinderMessage({
      matchId,
      senderId,
      content: dto.content.trim(),
    });

    const created = await this.petinderMessageRepository.create(message);

    return {
      id: created.id!,
      matchId: created.matchId,
      senderId: created.senderId,
      content: created.content,
      createdAt: created.createdAt!,
    };
  }
}

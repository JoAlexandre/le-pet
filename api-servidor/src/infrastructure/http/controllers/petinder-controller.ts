import { Response, NextFunction } from 'express';
import { EnablePetinderUseCase } from '../../../application/use-cases/petinder/enable-petinder-use-case';
import { DisablePetinderUseCase } from '../../../application/use-cases/petinder/disable-petinder-use-case';
import { GetPetinderProfileUseCase } from '../../../application/use-cases/petinder/get-petinder-profile-use-case';
import { GetPetinderRecommendationsUseCase } from '../../../application/use-cases/petinder/get-petinder-recommendations-use-case';
import { SwipePetinderUseCase } from '../../../application/use-cases/petinder/swipe-petinder-use-case';
import { ListPetinderMatchesUseCase } from '../../../application/use-cases/petinder/list-petinder-matches-use-case';
import { SendPetinderMessageUseCase } from '../../../application/use-cases/petinder/send-petinder-message-use-case';
import { ListPetinderMessagesUseCase } from '../../../application/use-cases/petinder/list-petinder-messages-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { EnablePetinderDto } from '../../../application/dtos/enable-petinder-dto';
import { SwipePetinderDto } from '../../../application/dtos/swipe-petinder-dto';
import { SendPetinderMessageDto } from '../../../application/dtos/send-petinder-message-dto';

export class PetinderController {
  constructor(
    private enablePetinderUseCase: EnablePetinderUseCase,
    private disablePetinderUseCase: DisablePetinderUseCase,
    private getPetinderProfileUseCase: GetPetinderProfileUseCase,
    private getPetinderRecommendationsUseCase: GetPetinderRecommendationsUseCase,
    private swipePetinderUseCase: SwipePetinderUseCase,
    private listPetinderMatchesUseCase: ListPetinderMatchesUseCase,
    private sendPetinderMessageUseCase: SendPetinderMessageUseCase,
    private listPetinderMessagesUseCase: ListPetinderMessagesUseCase,
  ) {}

  async enable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.enablePetinderUseCase.execute(
        req.user!.sub,
        req.body as EnablePetinderDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async disable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.disablePetinderUseCase.execute(req.user!.sub, req.params.animalId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getPetinderProfileUseCase.execute(
        req.params.animalId as string,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getRecommendations(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.getPetinderRecommendationsUseCase.execute(
        req.user!.sub,
        req.params.animalId as string,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async swipe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.swipePetinderUseCase.execute(
        req.user!.sub,
        req.body as SwipePetinderDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listMatches(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listPetinderMatchesUseCase.execute(
        req.user!.sub,
        req.params.animalId as string,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.sendPetinderMessageUseCase.execute(
        req.user!.sub,
        req.params.matchId as string,
        req.body as SendPetinderMessageDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listMessages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listPetinderMessagesUseCase.execute(
        req.user!.sub,
        req.params.matchId as string,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

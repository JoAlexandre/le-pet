import { Response, NextFunction } from 'express';
import { CreateAnimalUseCase } from '../../../application/use-cases/animal/create-animal-use-case';
import { GetAnimalUseCase } from '../../../application/use-cases/animal/get-animal-use-case';
import { ListAnimalsUseCase } from '../../../application/use-cases/animal/list-animals-use-case';
import { UpdateAnimalUseCase } from '../../../application/use-cases/animal/update-animal-use-case';
import { DeleteAnimalUseCase } from '../../../application/use-cases/animal/delete-animal-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateAnimalDto } from '../../../application/dtos/create-animal-dto';
import { UpdateAnimalDto } from '../../../application/dtos/update-animal-dto';

export class AnimalController {
  constructor(
    private createAnimalUseCase: CreateAnimalUseCase,
    private getAnimalUseCase: GetAnimalUseCase,
    private listAnimalsUseCase: ListAnimalsUseCase,
    private updateAnimalUseCase: UpdateAnimalUseCase,
    private deleteAnimalUseCase: DeleteAnimalUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createAnimalUseCase.execute(
        req.user!.sub,
        req.body as CreateAnimalDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getAnimalUseCase.execute(
        req.params.id as string,
        req.user!.sub,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listAnimalsUseCase.execute(req.user!.sub, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateAnimalUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as UpdateAnimalDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteAnimalUseCase.execute(req.params.id as string, req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

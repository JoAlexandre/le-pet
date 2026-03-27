import { Request, Response, NextFunction } from 'express';
import { ListPlansUseCase } from '../../../application/use-cases/subscription/list-plans-use-case';

export class PlanController {
  constructor(private listPlansUseCase: ListPlansUseCase) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.query.role as string | undefined;
      const result = await this.listPlansUseCase.execute(role);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

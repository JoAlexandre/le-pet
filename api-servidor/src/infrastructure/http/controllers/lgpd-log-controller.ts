import { Response, NextFunction } from 'express';
import { ListLgpdLogsUseCase } from '../../../application/use-cases/lgpd/list-lgpd-logs-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';

export class LgpdLogController {
  constructor(private listLgpdLogsUseCase: ListLgpdLogsUseCase) {}

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const userId = req.query.userId as string | undefined;
      const method = req.query.method as string | undefined;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      const result = await this.listLgpdLogsUseCase.execute({
        page,
        limit,
        userId,
        method,
        startDate,
        endDate,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

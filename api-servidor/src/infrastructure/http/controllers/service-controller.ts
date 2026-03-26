import { Response, NextFunction } from 'express';
import { CreateServiceUseCase } from '../../../application/use-cases/service/create-service-use-case';
import { GetServiceUseCase } from '../../../application/use-cases/service/get-service-use-case';
import { ListServicesUseCase } from '../../../application/use-cases/service/list-services-use-case';
import { UpdateServiceUseCase } from '../../../application/use-cases/service/update-service-use-case';
import { DeleteServiceUseCase } from '../../../application/use-cases/service/delete-service-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateServiceDto } from '../../../application/dtos/create-service-dto';
import { UpdateServiceDto } from '../../../application/dtos/update-service-dto';

export class ServiceController {
  constructor(
    private createServiceUseCase: CreateServiceUseCase,
    private getServiceUseCase: GetServiceUseCase,
    private listServicesUseCase: ListServicesUseCase,
    private updateServiceUseCase: UpdateServiceUseCase,
    private deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createServiceUseCase.execute(
        req.user!.sub,
        req.user!.role!,
        req.body as CreateServiceDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getServiceUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const companyId = req.query.companyId as string | undefined;
      const professionalId = req.query.professionalId as string | undefined;
      const result = await this.listServicesUseCase.execute(
        page,
        limit,
        companyId,
        professionalId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateServiceUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
        req.body as UpdateServiceDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteServiceUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { RegisterVaccineUseCase } from '../../../application/use-cases/vaccine/register-vaccine-use-case';
import { ListVaccineRecordsUseCase } from '../../../application/use-cases/vaccine/list-vaccine-records-use-case';
import { ListAllVaccineRecordsUseCase } from '../../../application/use-cases/vaccine/list-all-vaccine-records-use-case';
import { ListVaccineRecordsByTutorUseCase } from '../../../application/use-cases/vaccine/list-vaccine-records-by-tutor-use-case';
import { ListVaccineRecordsByProfessionalUseCase } from '../../../application/use-cases/vaccine/list-vaccine-records-by-professional-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateVaccineRecordDto } from '../../../application/dtos/create-vaccine-record-dto';

export class VaccineController {
  constructor(
    private registerVaccineUseCase: RegisterVaccineUseCase,
    private listVaccineRecordsUseCase: ListVaccineRecordsUseCase,
    private listAllVaccineRecordsUseCase: ListAllVaccineRecordsUseCase,
    private listVaccineRecordsByTutorUseCase: ListVaccineRecordsByTutorUseCase,
    private listVaccineRecordsByProfessionalUseCase: ListVaccineRecordsByProfessionalUseCase,
  ) {}

  async register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.registerVaccineUseCase.execute(
        req.params.animalId as string,
        req.user!.sub,
        req.body as CreateVaccineRecordDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listByAnimal(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listVaccineRecordsUseCase.execute(
        req.params.animalId as string,
        req.user!.sub,
        req.user!.role!,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listAllVaccineRecordsUseCase.execute(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listByTutor(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listVaccineRecordsByTutorUseCase.execute(
        req.user!.sub,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listByProfessional(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listVaccineRecordsByProfessionalUseCase.execute(
        req.user!.sub,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

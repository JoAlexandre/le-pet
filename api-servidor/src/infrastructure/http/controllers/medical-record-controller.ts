import { Response, NextFunction } from 'express';
import { CreateMedicalRecordUseCase } from '../../../application/use-cases/medical-record/create-medical-record-use-case';
import { GetMedicalRecordUseCase } from '../../../application/use-cases/medical-record/get-medical-record-use-case';
import { ListMedicalRecordsByAnimalUseCase } from '../../../application/use-cases/medical-record/list-medical-records-by-animal-use-case';
import { ListMedicalRecordsByProfessionalUseCase } from '../../../application/use-cases/medical-record/list-medical-records-by-professional-use-case';
import { UpdateMedicalRecordUseCase } from '../../../application/use-cases/medical-record/update-medical-record-use-case';
import { DeleteMedicalRecordUseCase } from '../../../application/use-cases/medical-record/delete-medical-record-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateMedicalRecordDto } from '../../../application/dtos/create-medical-record-dto';
import { UpdateMedicalRecordDto } from '../../../application/dtos/update-medical-record-dto';

export class MedicalRecordController {
  constructor(
    private createMedicalRecordUseCase: CreateMedicalRecordUseCase,
    private getMedicalRecordUseCase: GetMedicalRecordUseCase,
    private listMedicalRecordsByAnimalUseCase: ListMedicalRecordsByAnimalUseCase,
    private listMedicalRecordsByProfessionalUseCase: ListMedicalRecordsByProfessionalUseCase,
    private updateMedicalRecordUseCase: UpdateMedicalRecordUseCase,
    private deleteMedicalRecordUseCase: DeleteMedicalRecordUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createMedicalRecordUseCase.execute(
        req.params.animalId as string,
        req.user!.sub,
        req.user!.role!,
        req.body as CreateMedicalRecordDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getMedicalRecordUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listByAnimal(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const type = req.query.type as string | undefined;
      const result = await this.listMedicalRecordsByAnimalUseCase.execute(
        req.params.animalId as string,
        type,
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
      const result = await this.listMedicalRecordsByProfessionalUseCase.execute(
        req.user!.sub,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateMedicalRecordUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as UpdateMedicalRecordDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteMedicalRecordUseCase.execute(
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

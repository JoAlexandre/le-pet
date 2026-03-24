import { Response, NextFunction } from 'express';
import { CreateProfessionalUseCase } from '../../../application/use-cases/professional/create-professional-use-case';
import { GetProfessionalUseCase } from '../../../application/use-cases/professional/get-professional-use-case';
import { ListProfessionalsUseCase } from '../../../application/use-cases/professional/list-professionals-use-case';
import { UpdateProfessionalUseCase } from '../../../application/use-cases/professional/update-professional-use-case';
import { VerifyCrmvUseCase } from '../../../application/use-cases/professional/verify-crmv-use-case';
import { LookupCrmvUseCase } from '../../../application/use-cases/professional/lookup-crmv-use-case';
import { AssociateCompanyUseCase } from '../../../application/use-cases/professional/associate-company-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateProfessionalDto } from '../../../application/dtos/create-professional-dto';
import { UpdateProfessionalDto } from '../../../application/dtos/update-professional-dto';

export class ProfessionalController {
  constructor(
    private createProfessionalUseCase: CreateProfessionalUseCase,
    private getProfessionalUseCase: GetProfessionalUseCase,
    private listProfessionalsUseCase: ListProfessionalsUseCase,
    private updateProfessionalUseCase: UpdateProfessionalUseCase,
    private verifyCrmvUseCase: VerifyCrmvUseCase,
    private lookupCrmvUseCase: LookupCrmvUseCase,
    private associateCompanyUseCase: AssociateCompanyUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createProfessionalUseCase.execute(
        req.user!.sub,
        req.body as CreateProfessionalDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getProfessionalUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listProfessionalsUseCase.execute(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as UpdateProfessionalDto;
      const result = await this.updateProfessionalUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        body,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async verifyCrmv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.verifyCrmvUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async lookupCrmv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const crmvNumber = req.query.crmvNumber as string;
      const crmvState = req.query.crmvState as string;
      const result = await this.lookupCrmvUseCase.execute(crmvNumber, crmvState);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async associateCompany(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const associateBody = req.body as { companyId: string };
      const result = await this.associateCompanyUseCase.execute(
        req.params.id as string,
        associateBody.companyId,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

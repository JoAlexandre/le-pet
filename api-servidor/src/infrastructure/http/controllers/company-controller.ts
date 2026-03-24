import { Response, NextFunction } from 'express';
import { CreateCompanyUseCase } from '../../../application/use-cases/company/create-company-use-case';
import { GetCompanyUseCase } from '../../../application/use-cases/company/get-company-use-case';
import { ListCompaniesUseCase } from '../../../application/use-cases/company/list-companies-use-case';
import { UpdateCompanyUseCase } from '../../../application/use-cases/company/update-company-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateCompanyDto } from '../../../application/dtos/create-company-dto';
import { UpdateCompanyDto } from '../../../application/dtos/update-company-dto';

export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private getCompanyUseCase: GetCompanyUseCase,
    private listCompaniesUseCase: ListCompaniesUseCase,
    private updateCompanyUseCase: UpdateCompanyUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createCompanyUseCase.execute(
        req.user!.sub,
        req.body as CreateCompanyDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getCompanyUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listCompaniesUseCase.execute(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as UpdateCompanyDto;
      const result = await this.updateCompanyUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        body,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

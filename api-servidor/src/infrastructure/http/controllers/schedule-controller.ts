import { Response, NextFunction } from 'express';
import { CreateScheduleUseCase } from '../../../application/use-cases/schedule/create-schedule-use-case';
import { ListSchedulesUseCase } from '../../../application/use-cases/schedule/list-schedules-use-case';
import { GetProfessionalScheduleUseCase } from '../../../application/use-cases/schedule/get-professional-schedule-use-case';
import { GetCompanyScheduleUseCase } from '../../../application/use-cases/schedule/get-company-schedule-use-case';
import { UpdateScheduleUseCase } from '../../../application/use-cases/schedule/update-schedule-use-case';
import { DeleteScheduleUseCase } from '../../../application/use-cases/schedule/delete-schedule-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateScheduleDto } from '../../../application/dtos/create-schedule-dto';
import { UpdateScheduleDto } from '../../../application/dtos/update-schedule-dto';

export class ScheduleController {
  constructor(
    private createScheduleUseCase: CreateScheduleUseCase,
    private listSchedulesUseCase: ListSchedulesUseCase,
    private getProfessionalScheduleUseCase: GetProfessionalScheduleUseCase,
    private getCompanyScheduleUseCase: GetCompanyScheduleUseCase,
    private updateScheduleUseCase: UpdateScheduleUseCase,
    private deleteScheduleUseCase: DeleteScheduleUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createScheduleUseCase.execute(
        req.user!.sub,
        req.user!.role!,
        req.body as CreateScheduleDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listSchedulesUseCase.execute(
        req.user!.sub,
        req.user!.role!,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfessionalSchedule(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.getProfessionalScheduleUseCase.execute(
        req.params.professionalId as string,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCompanySchedule(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.getCompanyScheduleUseCase.execute(
        req.params.companyId as string,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateScheduleUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
        req.body as UpdateScheduleDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteScheduleUseCase.execute(
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

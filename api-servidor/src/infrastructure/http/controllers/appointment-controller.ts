import { Response, NextFunction } from 'express';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/create-appointment-use-case';
import { GetAppointmentUseCase } from '../../../application/use-cases/appointment/get-appointment-use-case';
import { ListAppointmentsUseCase } from '../../../application/use-cases/appointment/list-appointments-use-case';
import { UpdateAppointmentStatusUseCase } from '../../../application/use-cases/appointment/update-appointment-status-use-case';
import { CancelAppointmentUseCase } from '../../../application/use-cases/appointment/cancel-appointment-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateAppointmentDto } from '../../../application/dtos/create-appointment-dto';
import { UpdateAppointmentStatusDto } from '../../../application/dtos/update-appointment-status-dto';

export class AppointmentController {
  constructor(
    private createAppointmentUseCase: CreateAppointmentUseCase,
    private getAppointmentUseCase: GetAppointmentUseCase,
    private listAppointmentsUseCase: ListAppointmentsUseCase,
    private updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase,
    private cancelAppointmentUseCase: CancelAppointmentUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createAppointmentUseCase.execute(
        req.user!.sub,
        req.user!.role!,
        req.body as CreateAppointmentDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getAppointmentUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
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
      const result = await this.listAppointmentsUseCase.execute(
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

  async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.updateAppointmentStatusUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
        req.body as UpdateAppointmentStatusDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cancellationReason } = req.body as { cancellationReason?: string };
      const result = await this.cancelAppointmentUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.user!.role!,
        cancellationReason,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

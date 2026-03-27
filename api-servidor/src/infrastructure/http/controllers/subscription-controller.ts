import { Response, NextFunction } from 'express';
import { GetCurrentSubscriptionUseCase } from '../../../application/use-cases/subscription/get-current-subscription-use-case';
import { CreateCheckoutUseCase } from '../../../application/use-cases/subscription/create-checkout-use-case';
import { ChangePlanUseCase } from '../../../application/use-cases/subscription/change-plan-use-case';
import { CancelSubscriptionUseCase } from '../../../application/use-cases/subscription/cancel-subscription-use-case';
import { GetBillingPortalUseCase } from '../../../application/use-cases/subscription/get-billing-portal-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateCheckoutDto } from '../../../application/dtos/create-checkout-dto';
import { ChangePlanDto } from '../../../application/dtos/change-plan-dto';
import { Role } from '../../../domain/enums/role';

export class SubscriptionController {
  constructor(
    private getCurrentSubscriptionUseCase: GetCurrentSubscriptionUseCase,
    private createCheckoutUseCase: CreateCheckoutUseCase,
    private changePlanUseCase: ChangePlanUseCase,
    private cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private getBillingPortalUseCase: GetBillingPortalUseCase,
  ) {}

  async getCurrent(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.getCurrentSubscriptionUseCase.execute(
        req.user!.sub,
        req.user!.role as Role,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as CreateCheckoutDto;
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;
      const successUrl = `${baseUrl}/api/v1/subscriptions/success`;
      const cancelUrl = `${baseUrl}/api/v1/subscriptions/cancel`;

      const result = await this.createCheckoutUseCase.execute(
        req.user!.sub,
        dto,
        successUrl,
        cancelUrl,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePlan(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as ChangePlanDto;
      const result = await this.changePlanUseCase.execute(req.user!.sub, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.cancelSubscriptionUseCase.execute(req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async billingPortal(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const protocol = req.protocol;
      const host = req.get('host');
      const returnUrl = `${protocol}://${host}/api/v1/subscriptions/me`;

      const result = await this.getBillingPortalUseCase.execute(
        req.user!.sub,
        returnUrl,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

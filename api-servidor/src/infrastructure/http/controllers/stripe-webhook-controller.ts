import { Request, Response, NextFunction } from 'express';
import { HandleStripeWebhookUseCase } from '../../../application/use-cases/subscription/handle-stripe-webhook-use-case';

export class StripeWebhookController {
  constructor(
    private handleStripeWebhookUseCase: HandleStripeWebhookUseCase,
  ) {}

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      if (!signature) {
        res.status(400).json({ error: 'Missing stripe-signature header' });
        return;
      }

      await this.handleStripeWebhookUseCase.execute(req.body as Buffer, signature);
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

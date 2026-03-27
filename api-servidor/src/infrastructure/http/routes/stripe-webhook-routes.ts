import { Router, raw } from 'express';
import { stripeWebhookController } from '../dependencies';

const stripeWebhookRouter = Router();

/**
 * @openapi
 * /webhooks/stripe:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Stripe webhook endpoint
 *     description: >
 *       Receives Stripe webhook events for subscription lifecycle management.
 *       This endpoint validates the Stripe signature and processes events such as
 *       checkout.session.completed, invoice.paid, invoice.payment_failed,
 *       customer.subscription.updated, and customer.subscription.deleted.
 *       This endpoint does NOT use JSON body parser - it requires raw body for
 *       Stripe signature verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe event payload (validated via signature)
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *       400:
 *         description: Missing signature or invalid event
 */
stripeWebhookRouter.post(
  '/webhooks/stripe',
  raw({ type: 'application/json' }),
  (req, res, next) => stripeWebhookController.handleWebhook(req, res, next),
);

export { stripeWebhookRouter };

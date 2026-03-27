import { Router } from 'express';
import { subscriptionController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';

const subscriptionRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     SubscriptionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         userId:
 *           type: string
 *           format: uuid
 *         planId:
 *           type: string
 *           format: uuid
 *         planName:
 *           type: string
 *         planSlug:
 *           type: string
 *         tier:
 *           type: string
 *           enum: [FREE, BASIC, PREMIUM]
 *         role:
 *           type: string
 *           enum: [TUTOR, PROFESSIONAL, COMPANY]
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, PAST_DUE, CANCELED, TRIALING, INCOMPLETE]
 *         currentPeriodStart:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         currentPeriodEnd:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         cancelAtPeriodEnd:
 *           type: boolean
 *         limits:
 *           $ref: '#/components/schemas/PlanLimits'
 *     CheckoutResponse:
 *       type: object
 *       properties:
 *         clientSecret:
 *           type: string
 *         sessionId:
 *           type: string
 *     BillingPortalResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 */

/**
 * @openapi
 * /subscriptions/me:
 *   get:
 *     tags:
 *       - Subscriptions
 *     summary: Get current subscription
 *     description: >
 *       Returns the current subscription and plan details for the authenticated user.
 *       If the user has no active subscription, returns the FREE plan with its limits.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current subscription details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionResponse'
 *       401:
 *         description: Unauthorized
 */
subscriptionRouter.get(
  '/subscriptions/me',
  authMiddleware,
  (req, res, next) => subscriptionController.getCurrent(req, res, next),
);

/**
 * @openapi
 * /subscriptions/checkout:
 *   post:
 *     tags:
 *       - Subscriptions
 *     summary: Create Stripe checkout session
 *     description: >
 *       Creates a Stripe Checkout session for the specified plan.
 *       Returns a client secret for the embedded checkout flow.
 *       Cannot checkout a FREE plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the plan to subscribe to
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Invalid plan or cannot checkout free plan
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */
subscriptionRouter.post(
  '/subscriptions/checkout',
  authMiddleware,
  (req, res, next) => subscriptionController.checkout(req, res, next),
);

/**
 * @openapi
 * /subscriptions/change-plan:
 *   post:
 *     tags:
 *       - Subscriptions
 *     summary: Change subscription plan
 *     description: >
 *       Upgrades or downgrades the current subscription to a different plan.
 *       The new plan must be of the same role as the current plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPlanId
 *             properties:
 *               newPlanId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the new plan
 *     responses:
 *       200:
 *         description: Plan changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionResponse'
 *       400:
 *         description: Invalid plan change
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription or plan not found
 */
subscriptionRouter.post(
  '/subscriptions/change-plan',
  authMiddleware,
  (req, res, next) => subscriptionController.changePlan(req, res, next),
);

/**
 * @openapi
 * /subscriptions/cancel:
 *   post:
 *     tags:
 *       - Subscriptions
 *     summary: Cancel subscription
 *     description: >
 *       Cancels the current subscription at the end of the billing period.
 *       The subscription remains active until the current period ends.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Subscription canceled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Active subscription not found
 */
subscriptionRouter.post(
  '/subscriptions/cancel',
  authMiddleware,
  (req, res, next) => subscriptionController.cancel(req, res, next),
);

/**
 * @openapi
 * /subscriptions/portal:
 *   get:
 *     tags:
 *       - Subscriptions
 *     summary: Get Stripe billing portal URL
 *     description: >
 *       Generates a URL to the Stripe Billing Portal where the user
 *       can manage payment methods, view invoices, and manage their subscription.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Billing portal URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BillingPortalResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Active subscription not found
 */
subscriptionRouter.get(
  '/subscriptions/portal',
  authMiddleware,
  (req, res, next) => subscriptionController.billingPortal(req, res, next),
);

export { subscriptionRouter };

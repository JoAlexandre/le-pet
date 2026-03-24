import { Router } from 'express';
import { HealthController } from '../controllers/health-controller';

const healthRouter = Router();
const healthController = new HealthController();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Returns the API health status
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2026-03-23T12:00:00.000Z'
 */
healthRouter.get('/health', (req, res) => healthController.check(req, res));

export { healthRouter };

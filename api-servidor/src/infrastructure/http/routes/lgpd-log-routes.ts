import { Router } from 'express';
import { lgpdLogController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

const lgpdLogRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     LgpdLogEntry:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: request_log
 *         method:
 *           type: string
 *           example: POST
 *         path:
 *           type: string
 *           example: /api/v1/animals
 *         statusCode:
 *           type: integer
 *           example: 201
 *         durationMs:
 *           type: integer
 *           example: 42
 *         user:
 *           type: object
 *           nullable: true
 *           properties:
 *             sub:
 *               type: string
 *               format: uuid
 *             email:
 *               type: string
 *               format: email
 *             role:
 *               type: string
 *               enum: [ADMIN, TUTOR, COMPANY, PROFESSIONAL]
 *         origin:
 *           type: object
 *           properties:
 *             ip:
 *               type: string
 *               example: '::1'
 *             userAgent:
 *               type: string
 *               example: 'Mozilla/5.0'
 *             origin:
 *               type: string
 *               nullable: true
 *               example: 'http://localhost:3000'
 *         data:
 *           type: object
 *           description: Request body, params and query when present
 *           properties:
 *             body:
 *               type: object
 *             params:
 *               type: object
 *             query:
 *               type: object
 *         level:
 *           type: string
 *           example: info
 *         timestamp:
 *           type: string
 *           example: '2026-03-24 14:30:00'
 *     PaginatedLgpdLogs:
 *       type: object
 *       properties:
 *         logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LgpdLogEntry'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

/**
 * @openapi
 * /lgpd/logs:
 *   get:
 *     tags:
 *       - LGPD
 *     summary: List LGPD audit logs
 *     description: >
 *       Returns paginated LGPD audit logs with request data, user info, origin
 *       and response status. Only ADMIN users can access this endpoint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user UUID
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE, PATCH]
 *         description: Filter by HTTP method
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs from this date (YYYY-MM-DD HH:mm:ss)
 *         example: '2026-03-01 00:00:00'
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs until this date (YYYY-MM-DD HH:mm:ss)
 *         example: '2026-03-24 23:59:59'
 *     responses:
 *       200:
 *         description: Paginated list of LGPD audit logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedLgpdLogs'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - only ADMIN users can view logs
 */
lgpdLogRouter.get(
  '/lgpd/logs',
  authMiddleware,
  roleMiddleware('ADMIN'),
  (req, res, next) => lgpdLogController.list(req, res, next),
);

export { lgpdLogRouter };

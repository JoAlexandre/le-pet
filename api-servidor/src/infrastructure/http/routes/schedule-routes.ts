import { Router } from 'express';
import { scheduleController, quotaService } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { requireFeature } from '../middlewares/require-feature-middleware';

const scheduleRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         ownerId:
 *           type: string
 *           format: uuid
 *         ownerType:
 *           type: string
 *           enum: [COMPANY, PROFESSIONAL]
 *         dayOfWeek:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *           description: 0=Sunday, 1=Monday, ..., 6=Saturday
 *         startTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *           description: Start time in HH:mm format
 *         endTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *           description: End time in HH:mm format
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /schedules:
 *   post:
 *     tags:
 *       - Schedules
 *     summary: Create a schedule slot
 *     description: >
 *       Creates a recurring weekly schedule slot.
 *       Companies create schedules for their establishment.
 *       Independent professionals (not linked to a company) create their own schedules.
 *       Professionals linked to a company cannot create schedules (they follow the company schedule).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: 0=Sunday, 1=Monday, ..., 6=Saturday
 *               startTime:
 *                 type: string
 *                 description: Start time in HH:mm format
 *               endTime:
 *                 type: string
 *                 description: End time in HH:mm format
 *           example:
 *             dayOfWeek: 1
 *             startTime: "08:00"
 *             endTime: "12:00"
 *     responses:
 *       201:
 *         description: Schedule slot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - COMPANY or independent PROFESSIONAL required
 *       409:
 *         description: Schedule conflicts with existing slot
 */
scheduleRouter.post(
  '/schedules',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL'),
  requireFeature(quotaService, 'canExposeSchedule'),
  (req, res, next) => scheduleController.create(req, res, next),
);

/**
 * @openapi
 * /schedules:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: List own schedules
 *     description: >
 *       Lists all schedule slots owned by the authenticated user.
 *       Companies see their company schedules.
 *       Professionals see their own schedules (if independent).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedule slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScheduleResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
scheduleRouter.get(
  '/schedules',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL'),
  (req, res, next) => scheduleController.list(req, res, next),
);

/**
 * @openapi
 * /schedules/professional/{professionalId}:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: View a professional's available schedule
 *     description: >
 *       Returns the available schedule for a professional.
 *       If the professional is linked to a company, returns the company schedule.
 *       If the professional is independent, returns their own schedule.
 *       Any authenticated user can view this (intended for tutors).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Professional user ID
 *     responses:
 *       200:
 *         description: Professional's available schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScheduleResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No schedule found for this professional
 */
scheduleRouter.get(
  '/schedules/professional/:professionalId',
  authMiddleware,
  (req, res, next) => scheduleController.getProfessionalSchedule(req, res, next),
);

/**
 * @openapi
 * /schedules/company/{companyId}:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: View a company's schedule
 *     description: >
 *       Returns the schedule for a company.
 *       Any authenticated user can view this (intended for tutors).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company's schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScheduleResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
scheduleRouter.get(
  '/schedules/company/:companyId',
  authMiddleware,
  (req, res, next) => scheduleController.getCompanySchedule(req, res, next),
);

/**
 * @openapi
 * /schedules/{id}:
 *   put:
 *     tags:
 *       - Schedules
 *     summary: Update a schedule slot
 *     description: >
 *       Updates a schedule slot. Only the owner (company or independent professional) can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *           example:
 *             startTime: "09:00"
 *             endTime: "13:00"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the schedule owner
 *       404:
 *         description: Schedule not found
 *       409:
 *         description: Schedule conflicts with existing slot
 */
scheduleRouter.put(
  '/schedules/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL'),
  requireFeature(quotaService, 'canExposeSchedule'),
  (req, res, next) => scheduleController.update(req, res, next),
);

/**
 * @openapi
 * /schedules/{id}:
 *   delete:
 *     tags:
 *       - Schedules
 *     summary: Delete a schedule slot
 *     description: >
 *       Deletes a schedule slot. Only the owner can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *     responses:
 *       204:
 *         description: Schedule deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the schedule owner
 *       404:
 *         description: Schedule not found
 */
scheduleRouter.delete(
  '/schedules/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL'),
  requireFeature(quotaService, 'canExposeSchedule'),
  (req, res, next) => scheduleController.delete(req, res, next),
);

export { scheduleRouter };

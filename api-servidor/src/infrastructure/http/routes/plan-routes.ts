import { Router } from 'express';
import { planController } from '../dependencies';

const planRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     PlanLimits:
 *       type: object
 *       properties:
 *         maxAnimals:
 *           type: integer
 *           description: Maximum number of animals (-1 for unlimited)
 *         maxServices:
 *           type: integer
 *           description: Maximum number of services (-1 for unlimited)
 *         maxProducts:
 *           type: integer
 *           description: Maximum number of products (-1 for unlimited)
 *         maxEmployees:
 *           type: integer
 *           description: Maximum number of employees (-1 for unlimited)
 *         maxLostAnimalPosts:
 *           type: integer
 *           description: Maximum number of lost animal posts (-1 for unlimited)
 *         maxMedicalRecordsPerMonth:
 *           type: integer
 *           description: Maximum medical records per month (-1 for unlimited)
 *         canUsePetinder:
 *           type: boolean
 *         canExposeSchedule:
 *           type: boolean
 *         canUseOnlineAppointments:
 *           type: boolean
 *         canUseMedicalRecords:
 *           type: boolean
 *         hasSearchHighlight:
 *           type: boolean
 *         hasVaccineNotifications:
 *           type: boolean
 *         hasFullVaccineHistory:
 *           type: boolean
 *         hasReports:
 *           type: boolean
 *         hasAdvancedReports:
 *           type: boolean
 *     PlanResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         tier:
 *           type: string
 *           enum: [FREE, BASIC, PREMIUM]
 *         role:
 *           type: string
 *           enum: [TUTOR, PROFESSIONAL, COMPANY]
 *         price:
 *           type: number
 *           description: Price in BRL
 *         currency:
 *           type: string
 *         intervalMonths:
 *           type: integer
 *         limits:
 *           $ref: '#/components/schemas/PlanLimits'
 */

/**
 * @openapi
 * /plans:
 *   get:
 *     tags:
 *       - Plans
 *     summary: List available plans
 *     description: >
 *       Lists all active subscription plans. Optionally filter by role.
 *       This endpoint is public and does not require authentication.
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [TUTOR, PROFESSIONAL, COMPANY]
 *         description: Filter plans by role
 *     responses:
 *       200:
 *         description: List of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlanResponse'
 */
planRouter.get('/plans', (req, res, next) => planController.list(req, res, next));

export { planRouter };

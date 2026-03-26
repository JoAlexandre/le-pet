import { Router } from 'express';
import { vaccineController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { crmvMiddleware } from '../middlewares/crmv-middleware';
import { validationMiddleware } from '../middlewares/validation-middleware';

const vaccineRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     VaccineRecordResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         animalId:
 *           type: string
 *           format: uuid
 *         professionalId:
 *           type: string
 *           format: uuid
 *         vaccineName:
 *           type: string
 *         vaccineManufacturer:
 *           type: string
 *           nullable: true
 *         batchNumber:
 *           type: string
 *           nullable: true
 *         applicationDate:
 *           type: string
 *           format: date
 *         nextDoseDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PaginatedVaccineRecords:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VaccineRecordResponse'
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
 * /animals/{animalId}/vaccines:
 *   post:
 *     tags:
 *       - Vaccines
 *     summary: Register a vaccine for an animal
 *     description: >
 *       Registers a new vaccine record for the specified animal.
 *       Only VETERINARIAN professionals with CRMV status VERIFIED can register vaccines.
 *       VETERINARIANS with PENDING or REJECTED CRMV status will receive a 403 error.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vaccineName
 *               - applicationDate
 *             properties:
 *               vaccineName:
 *                 type: string
 *                 description: Name of the vaccine
 *               vaccineManufacturer:
 *                 type: string
 *                 description: Vaccine manufacturer (optional)
 *               batchNumber:
 *                 type: string
 *                 description: Vaccine batch number (optional)
 *               applicationDate:
 *                 type: string
 *                 format: date
 *                 description: Date the vaccine was applied (YYYY-MM-DD)
 *               nextDoseDate:
 *                 type: string
 *                 format: date
 *                 description: Date of next dose (YYYY-MM-DD, optional)
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *           examples:
 *             rabies:
 *               summary: Rabies vaccine
 *               value:
 *                 vaccineName: "Rabies (Nobivac Rabies)"
 *                 vaccineManufacturer: "MSD Animal Health"
 *                 batchNumber: "A1234B"
 *                 applicationDate: "2026-03-24"
 *                 nextDoseDate: "2027-03-24"
 *                 notes: "Annual booster applied"
 *             v10:
 *               summary: V10 vaccine (dogs)
 *               value:
 *                 vaccineName: "V10 (Vanguard Plus)"
 *                 vaccineManufacturer: "Zoetis"
 *                 batchNumber: "ZT5678C"
 *                 applicationDate: "2026-03-24"
 *                 nextDoseDate: "2027-03-24"
 *     responses:
 *       201:
 *         description: Vaccine record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VaccineRecordResponse'
 *       400:
 *         description: Invalid input (missing fields, invalid dates)
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - CRMV not verified or insufficient permissions
 *       404:
 *         description: Animal not found
 */
vaccineRouter.post(
  '/animals/:animalId/vaccines',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  crmvMiddleware,
  validationMiddleware({
    vaccineName: { required: true, type: 'string' },
    applicationDate: { required: true, type: 'string' },
  }),
  (req, res, next) => vaccineController.register(req, res, next),
);

/**
 * @openapi
 * /animals/{animalId}/vaccines:
 *   get:
 *     tags:
 *       - Vaccines
 *     summary: List vaccine records for an animal
 *     description: >
 *       Returns the vaccination history for a specific animal with pagination.
 *       Tutors can only view vaccines for their own animals.
 *       Professionals can view vaccines for any animal.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of vaccine records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVaccineRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner of the animal
 *       404:
 *         description: Animal not found
 */
vaccineRouter.get(
  '/animals/:animalId/vaccines',
  authMiddleware,
  roleMiddleware('TUTOR', 'PROFESSIONAL'),
  (req, res, next) => vaccineController.listByAnimal(req, res, next),
);

/**
 * @openapi
 * /vaccines:
 *   get:
 *     tags:
 *       - Vaccines
 *     summary: List all vaccine records (admin)
 *     description: >
 *       Returns all vaccination records in the system with pagination.
 *       Only ADMIN users can access this endpoint.
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of all vaccine records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVaccineRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
vaccineRouter.get('/vaccines', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) =>
  vaccineController.listAll(req, res, next),
);

/**
 * @openapi
 * /vaccines/my-animals:
 *   get:
 *     tags:
 *       - Vaccines
 *     summary: List vaccine records for all my animals
 *     description: >
 *       Returns all vaccination records across all animals belonging to the
 *       authenticated tutor, with pagination.
 *       Only users with TUTOR role can access this endpoint.
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of vaccine records for all tutor's animals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVaccineRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
vaccineRouter.get(
  '/vaccines/my-animals',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => vaccineController.listByTutor(req, res, next),
);

/**
 * @openapi
 * /vaccines/my-records:
 *   get:
 *     tags:
 *       - Vaccines
 *     summary: List vaccine records applied by the veterinarian
 *     description: >
 *       Returns all vaccination records applied by the authenticated professional,
 *       with pagination. Only users with PROFESSIONAL role can access this endpoint.
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of vaccine records applied by the professional
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVaccineRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
vaccineRouter.get(
  '/vaccines/my-records',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  (req, res, next) => vaccineController.listByProfessional(req, res, next),
);

export { vaccineRouter };

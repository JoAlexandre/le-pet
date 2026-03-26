import { Router } from 'express';
import { serviceController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

const serviceRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         professionalId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           enum: [BATH, GROOMING, VETERINARY, VACCINATION, TRAINING, DAYCARE, BOARDING, TRANSPORT, OTHER]
 *         price:
 *           type: number
 *           description: Price in BRL
 *         durationMinutes:
 *           type: integer
 *           nullable: true
 *           description: Estimated duration in minutes
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedServices:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceResponse'
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
 * /services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Create a service
 *     description: >
 *       Creates a new service for the authenticated company or professional.
 *       Users with COMPANY or PROFESSIONAL role can create services.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Service name
 *               description:
 *                 type: string
 *                 description: Service description (optional)
 *               category:
 *                 type: string
 *                 enum: [BATH, GROOMING, VETERINARY, VACCINATION, TRAINING, DAYCARE, BOARDING, TRANSPORT, OTHER]
 *               price:
 *                 type: number
 *                 description: Price in BRL
 *               durationMinutes:
 *                 type: integer
 *                 description: Estimated duration in minutes (optional)
 *           example:
 *             name: "Banho Completo"
 *             description: "Banho com shampoo especial e secagem"
 *             category: "BATH"
 *             price: 65.00
 *             durationMinutes: 60
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - COMPANY or PROFESSIONAL role required
 *       404:
 *         description: Company or professional not found for this user
 */
serviceRouter.post(
  '/services',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL', 'ADMIN'),
  (req, res, next) => serviceController.create(req, res, next),
);

/**
 * @openapi
 * /services:
 *   get:
 *     tags:
 *       - Services
 *     summary: List services
 *     description: >
 *       Lists all active services. Can filter by companyId or professionalId.
 *       Any authenticated user can list services.
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
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by company ID (optional)
 *       - in: query
 *         name: professionalId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by professional ID (optional)
 *     responses:
 *       200:
 *         description: Paginated list of services
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedServices'
 *       401:
 *         description: Unauthorized
 */
serviceRouter.get('/services', authMiddleware, (req, res, next) =>
  serviceController.list(req, res, next),
);

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get service details
 *     description: Returns details of a specific service.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
serviceRouter.get('/services/:id', authMiddleware, (req, res, next) =>
  serviceController.getById(req, res, next),
);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     tags:
 *       - Services
 *     summary: Update a service
 *     description: >
 *       Updates a service. Only the owner (company or professional) can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [BATH, GROOMING, VETERINARY, VACCINATION, TRAINING, DAYCARE, BOARDING, TRANSPORT, OTHER]
 *               price:
 *                 type: number
 *               durationMinutes:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *           example:
 *             name: "Banho Premium"
 *             price: 85.00
 *             durationMinutes: 90
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the service owner
 *       404:
 *         description: Service not found
 */
serviceRouter.put(
  '/services/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL', 'ADMIN'),
  (req, res, next) => serviceController.update(req, res, next),
);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Delete a service
 *     description: >
 *       Soft deletes a service. Only the owner (company or professional) can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       204:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the service owner
 *       404:
 *         description: Service not found
 */
serviceRouter.delete(
  '/services/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'PROFESSIONAL', 'ADMIN'),
  (req, res, next) => serviceController.delete(req, res, next),
);

export { serviceRouter };

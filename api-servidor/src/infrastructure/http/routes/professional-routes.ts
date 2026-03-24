import { Router } from 'express';
import { professionalController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

const professionalRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ProfessionalResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         specialtyType:
 *           type: string
 *           nullable: true
 *           enum: [VETERINARIAN, GROOMER, BATHER, TRAINER, OTHER]
 *         crmvNumber:
 *           type: string
 *           nullable: true
 *         crmvState:
 *           type: string
 *           nullable: true
 *         crmvStatus:
 *           type: string
 *           nullable: true
 *           enum: [PENDING, VERIFIED, REJECTED]
 *         phone:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         isOnboardingComplete:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedProfessionals:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProfessionalResponse'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     VerifyCrmvResponse:
 *       type: object
 *       properties:
 *         professional:
 *           $ref: '#/components/schemas/ProfessionalResponse'
 *         token:
 *           type: string
 *           description: New JWT with updated crmvStatus
 *         refreshToken:
 *           type: string
 *           description: New refresh token
 */

/**
 * @openapi
 * /professionals:
 *   post:
 *     tags:
 *       - Professionals
 *     summary: Create a professional
 *     description: >
 *       Creates a new professional user account with email/password authentication.
 *       Only users with COMPANY role can create professionals.
 *       The professional is automatically associated with the company of the requester.
 *       If specialtyType is VETERINARIAN, crmvNumber and crmvState are required and crmvStatus starts as PENDING.
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
 *               - email
 *               - password
 *               - specialtyType
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters, contain 1 uppercase letter and 1 number
 *               phone:
 *                 type: string
 *               specialtyType:
 *                 type: string
 *                 enum: [VETERINARIAN, GROOMER, BATHER, TRAINER, OTHER]
 *               crmvNumber:
 *                 type: string
 *                 description: Required when specialtyType is VETERINARIAN
 *               crmvState:
 *                 type: string
 *                 description: State abbreviation (2 chars), required when specialtyType is VETERINARIAN
 *           examples:
 *             veterinarian:
 *               summary: Veterinario (requer CRMV)
 *               value:
 *                 name: "Dr. Silva"
 *                 email: "silva@example.com"
 *                 password: "Secure1234"
 *                 phone: "11999998888"
 *                 specialtyType: "VETERINARIAN"
 *                 crmvNumber: "12345"
 *                 crmvState: "SP"
 *             groomer:
 *               summary: Tosador
 *               value:
 *                 name: "Carlos Oliveira"
 *                 email: "carlos@example.com"
 *                 password: "Secure1234"
 *                 phone: "11988887777"
 *                 specialtyType: "GROOMER"
 *             bather:
 *               summary: Banhista
 *               value:
 *                 name: "Ana Costa"
 *                 email: "ana@example.com"
 *                 password: "Secure1234"
 *                 phone: "11977776666"
 *                 specialtyType: "BATHER"
 *             trainer:
 *               summary: Adestrador
 *               value:
 *                 name: "Pedro Santos"
 *                 email: "pedro@example.com"
 *                 password: "Secure1234"
 *                 phone: "11966665555"
 *                 specialtyType: "TRAINER"
 *             other:
 *               summary: Outro
 *               value:
 *                 name: "Julia Ferreira"
 *                 email: "julia@example.com"
 *                 password: "Secure1234"
 *                 phone: "11955554444"
 *                 specialtyType: "OTHER"
 *     responses:
 *       201:
 *         description: Professional created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalResponse'
 *       400:
 *         description: Invalid input (missing fields, invalid specialty, password too weak)
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Only COMPANY role can create professionals
 *       409:
 *         description: Email already in use
 */
professionalRouter.post(
  '/professionals',
  authMiddleware,
  roleMiddleware('COMPANY'),
  (req, res, next) => professionalController.create(req, res, next),
);

/**
 * @openapi
 * /professionals:
 *   get:
 *     tags:
 *       - Professionals
 *     summary: List professionals
 *     description: Lists all professionals with pagination. Any authenticated user can view.
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
 *         description: List of professionals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProfessionals'
 *       401:
 *         description: Missing or invalid authorization
 */
professionalRouter.get('/professionals', authMiddleware, (req, res, next) =>
  professionalController.list(req, res, next),
);

/**
 * @openapi
 * /professionals/crmv-lookup:
 *   get:
 *     tags:
 *       - Professionals
 *     summary: Lookup CRMV registration
 *     description: >
 *       Queries the CFMV public database via web scraping to check if a CRMV
 *       registration exists and is active. This is a standalone lookup endpoint
 *       not tied to any specific professional in the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crmvNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: CRMV registration number
 *         example: "05363"
 *       - in: query
 *         name: crmvState
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *         description: State abbreviation (2 chars)
 *         example: "MT"
 *     responses:
 *       200:
 *         description: CRMV lookup result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 found:
 *                   type: boolean
 *                 active:
 *                   type: boolean
 *                 name:
 *                   type: string
 *                   nullable: true
 *                 registrationNumber:
 *                   type: string
 *                   nullable: true
 *                 state:
 *                   type: string
 *                   nullable: true
 *             examples:
 *               found:
 *                 summary: Registro encontrado e ativo
 *                 value:
 *                   found: true
 *                   active: true
 *                   name: "WALDECY ALEX DE OLIVEIRA E SILVA"
 *                   registrationNumber: "05363"
 *                   state: "MT"
 *               notFound:
 *                 summary: Registro nao encontrado
 *                 value:
 *                   found: false
 *                   active: false
 *                   name: null
 *                   registrationNumber: null
 *                   state: null
 *       400:
 *         description: Missing or invalid crmvNumber/crmvState
 *       401:
 *         description: Missing or invalid authorization
 *       502:
 *         description: CFMV service unavailable or scraping failed
 */
professionalRouter.get('/professionals/crmv-lookup', authMiddleware, (req, res, next) =>
  professionalController.lookupCrmv(req, res, next),
);

/**
 * @openapi
 * /professionals/{id}:
 *   get:
 *     tags:
 *       - Professionals
 *     summary: Get professional details
 *     description: Returns details of a specific professional.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Professional (user) ID
 *     responses:
 *       200:
 *         description: Professional details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Professional not found
 */
professionalRouter.get('/professionals/:id', authMiddleware, (req, res, next) =>
  professionalController.getById(req, res, next),
);

/**
 * @openapi
 * /professionals/{id}:
 *   put:
 *     tags:
 *       - Professionals
 *     summary: Update professional profile
 *     description: Updates a professional's profile. Only the professional themselves can update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Professional (user) ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               specialtyType:
 *                 type: string
 *                 enum: [VETERINARIAN, GROOMER, BATHER, TRAINER, OTHER]
 *               crmvNumber:
 *                 type: string
 *                 description: Required when specialtyType is VETERINARIAN
 *               crmvState:
 *                 type: string
 *                 description: State abbreviation (2 chars), required when specialtyType is VETERINARIAN
 *           example:
 *             name: "Dr. Silva"
 *             phone: "11999998888"
 *             specialtyType: "VETERINARIAN"
 *             crmvNumber: "12345"
 *             crmvState: "SP"
 *     responses:
 *       200:
 *         description: Professional updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Professional not found
 */
professionalRouter.put(
  '/professionals/:id',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  (req, res, next) => professionalController.update(req, res, next),
);

/**
 * @openapi
 * /professionals/{id}/verify-crmv:
 *   post:
 *     tags:
 *       - Professionals
 *     summary: Verify CRMV
 *     description: >
 *       Verifies the CRMV registration of a veterinarian professional by consulting
 *       the CFMV public database via web scraping. No input is required from the client -
 *       the verification is performed entirely server-side using the professional's
 *       registered crmvNumber and crmvState. If the registration is found and active,
 *       crmvStatus changes to VERIFIED. If not found or inactive, status changes to REJECTED.
 *       Returns new JWT and refresh token with updated crmvStatus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Professional (user) ID
 *     responses:
 *       200:
 *         description: CRMV verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyCrmvResponse'
 *       400:
 *         description: Invalid request (not a veterinarian, missing CRMV data, already verified, or inactive registration)
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Professional not found or CRMV registration not found in CFMV database
 *       502:
 *         description: CFMV service unavailable or scraping failed
 */
professionalRouter.post(
  '/professionals/:id/verify-crmv',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  (req, res, next) => professionalController.verifyCrmv(req, res, next),
);

/**
 * @openapi
 * /professionals/{id}/associate-company:
 *   post:
 *     tags:
 *       - Professionals
 *     summary: Associate professional with a company
 *     description: Creates a link between a professional and a company (petshop/clinic).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Professional (user) ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *             properties:
 *               companyId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the company to associate with
 *           example:
 *             companyId: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Association created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Professional or company not found
 *       409:
 *         description: Professional is already associated with this company
 */
professionalRouter.post(
  '/professionals/:id/associate-company',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  (req, res, next) => professionalController.associateCompany(req, res, next),
);

export { professionalRouter };

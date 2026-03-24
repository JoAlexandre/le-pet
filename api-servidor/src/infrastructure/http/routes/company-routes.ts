import { Router } from 'express';
import { companyController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
const companyRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     CompanyResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         tradeName:
 *           type: string
 *         legalName:
 *           type: string
 *         cnpj:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         logoUrl:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedCompanies:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompanyResponse'
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
 * /companies:
 *   post:
 *     tags:
 *       - Companies
 *     summary: Create a company
 *     description: Creates a new company profile. Only users with COMPANY role can create. Each user can have only one company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tradeName
 *               - legalName
 *               - phone
 *               - address
 *               - city
 *               - state
 *             properties:
 *               tradeName:
 *                 type: string
 *                 description: Trade name (nome fantasia)
 *               legalName:
 *                 type: string
 *                 description: Legal name (razao social)
 *               cnpj:
 *                 type: string
 *                 description: CNPJ (optional, 14 digits)
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *                 description: State abbreviation (2 chars)
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *           example:
 *             tradeName: "PetShop Amigo Fiel"
 *             legalName: "Amigo Fiel Comercio de Produtos Pet LTDA"
 *             cnpj: "12345678000195"
 *             phone: "11999998888"
 *             address: "Rua das Flores, 123"
 *             city: "Sao Paulo"
 *             state: "SP"
 *             description: "Petshop especializado em banho e tosa"
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 *       409:
 *         description: User already has a registered company
 */
companyRouter.post('/companies', authMiddleware, roleMiddleware('COMPANY'), (req, res, next) =>
  companyController.create(req, res, next),
);

/**
 * @openapi
 * /companies:
 *   get:
 *     tags:
 *       - Companies
 *     summary: List companies
 *     description: Lists all active companies with pagination. Any authenticated user can list.
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
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCompanies'
 *       401:
 *         description: Missing or invalid authorization
 */
companyRouter.get('/companies', authMiddleware, (req, res, next) =>
  companyController.list(req, res, next),
);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     tags:
 *       - Companies
 *     summary: Get company details
 *     description: Returns details of a specific company. Any authenticated user can view.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Company not found
 */
companyRouter.get('/companies/:id', authMiddleware, (req, res, next) =>
  companyController.getById(req, res, next),
);

/**
 * @openapi
 * /companies/{id}:
 *   put:
 *     tags:
 *       - Companies
 *     summary: Update company
 *     description: Updates a company profile. Only the owner (COMPANY role) can update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeName:
 *                 type: string
 *               legalName:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *           example:
 *             tradeName: "PetShop Amigo Fiel - Nova Unidade"
 *             phone: "11988887777"
 *             description: "Agora com servico de veterinaria"
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Company not found
 */
companyRouter.put('/companies/:id', authMiddleware, roleMiddleware('COMPANY'), (req, res, next) =>
  companyController.update(req, res, next),
);

export { companyRouter };

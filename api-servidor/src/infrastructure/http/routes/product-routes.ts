import { Router } from 'express';
import { productController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

const productRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductSizeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         sizeType:
 *           type: string
 *           enum: [CLOTHING, WEIGHT, VOLUME]
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         discountPercent:
 *           type: number
 *           nullable: true
 *         discountExpiresAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         effectivePrice:
 *           type: number
 *           description: Price after discount (if applicable)
 *         stock:
 *           type: integer
 *           nullable: true
 *         isActive:
 *           type: boolean
 *     ProductQuestionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *           nullable: true
 *         answeredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ProductRatingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           enum: [FOOD, TREATS, TOYS, HEALTH]
 *         productType:
 *           type: string
 *           enum: [WET, DRY, MIXED]
 *           nullable: true
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         averageRating:
 *           type: number
 *           nullable: true
 *         totalRatings:
 *           type: integer
 *         isFavorite:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         sizes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductSizeResponse'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedProducts:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductResponse'
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
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product
 *     description: >
 *       Creates a new product for the authenticated company.
 *       Only users with COMPANY role can create products.
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FOOD, TREATS, TOYS, HEALTH]
 *               productType:
 *                 type: string
 *                 enum: [WET, DRY, MIXED]
 *               imageUrl:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sizeType
 *                     - name
 *                     - price
 *                   properties:
 *                     sizeType:
 *                       type: string
 *                       enum: [CLOTHING, WEIGHT, VOLUME]
 *                     name:
 *                       type: string
 *                       description: "Size label (e.g. P, M, G, 3kg, 100ml)"
 *                     price:
 *                       type: number
 *                     discountPercent:
 *                       type: number
 *                       description: Discount percentage (0-100)
 *                     discountExpiresAt:
 *                       type: string
 *                       format: date-time
 *                     stock:
 *                       type: integer
 *           example:
 *             name: "Racao Premium para Caes Adultos"
 *             description: "Racao super premium para caes adultos de porte medio"
 *             category: "FOOD"
 *             productType: "DRY"
 *             sizes:
 *               - sizeType: "WEIGHT"
 *                 name: "3kg"
 *                 price: 69.90
 *                 discountPercent: 10
 *                 discountExpiresAt: "2027-12-31T23:59:59Z"
 *                 stock: 30
 *               - sizeType: "WEIGHT"
 *                 name: "15kg"
 *                 price: 189.90
 *                 stock: 20
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - COMPANY role required
 *       404:
 *         description: Company not found for this user
 */
productRouter.post(
  '/products',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.create(req, res, next),
);

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
 *     description: >
 *       Lists all active products with sizes, ratings, and favorite status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by company ID
 *     responses:
 *       200:
 *         description: Paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 *       401:
 *         description: Unauthorized
 */
productRouter.get('/products', authMiddleware, (req, res, next) =>
  productController.list(req, res, next),
);

/**
 * @openapi
 * /products/favorites:
 *   get:
 *     tags:
 *       - Products
 *     summary: List favorite products
 *     description: Lists all products favorited by the current user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 *       401:
 *         description: Unauthorized
 */
productRouter.get('/products/favorites', authMiddleware, (req, res, next) =>
  productController.listFavorites(req, res, next),
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product details
 *     description: Returns product details including sizes, rating, and favorite status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.get('/products/:id', authMiddleware, (req, res, next) =>
  productController.getById(req, res, next),
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     description: >
 *       Updates a product. Only the company owner can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                 enum: [FOOD, TREATS, TOYS, HEALTH]
 *               productType:
 *                 type: string
 *                 enum: [WET, DRY, MIXED]
 *                 nullable: true
 *               imageUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 */
productRouter.put(
  '/products/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.update(req, res, next),
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Soft deletes a product. Only the company owner can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 */
productRouter.delete(
  '/products/:id',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.delete(req, res, next),
);

/**
 * @openapi
 * /products/{id}/sizes:
 *   post:
 *     tags:
 *       - Product Sizes
 *     summary: Add a size variant to a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sizeType
 *               - name
 *               - price
 *             properties:
 *               sizeType:
 *                 type: string
 *                 enum: [CLOTHING, WEIGHT, VOLUME]
 *               name:
 *                 type: string
 *                 description: "Size label (e.g. P, M, G, 3kg, 100ml)"
 *               price:
 *                 type: number
 *               discountPercent:
 *                 type: number
 *                 description: Discount percentage (0-100)
 *               discountExpiresAt:
 *                 type: string
 *                 format: date-time
 *               stock:
 *                 type: integer
 *           example:
 *             sizeType: "WEIGHT"
 *             name: "5kg"
 *             price: 89.90
 *             discountPercent: 15
 *             stock: 25
 *     responses:
 *       201:
 *         description: Size added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductSizeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
productRouter.post(
  '/products/:id/sizes',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.addSize(req, res, next),
);

/**
 * @openapi
 * /products/sizes/{sizeId}:
 *   put:
 *     tags:
 *       - Product Sizes
 *     summary: Update a product size
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sizeType:
 *                 type: string
 *                 enum: [CLOTHING, WEIGHT, VOLUME]
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPercent:
 *                 type: number
 *                 nullable: true
 *               discountExpiresAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               stock:
 *                 type: integer
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductSizeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Size not found
 */
productRouter.put(
  '/products/sizes/:sizeId',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.updateSize(req, res, next),
);

/**
 * @openapi
 * /products/sizes/{sizeId}:
 *   delete:
 *     tags:
 *       - Product Sizes
 *     summary: Delete a product size
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Size deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Size not found
 */
productRouter.delete(
  '/products/sizes/:sizeId',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.deleteSize(req, res, next),
);

/**
 * @openapi
 * /products/{id}/ratings:
 *   post:
 *     tags:
 *       - Product Ratings
 *     summary: Rate a product (create or update)
 *     description: >
 *       Rate a product from 1-5. If user already rated, updates the existing rating.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *           example:
 *             rating: 5
 *             comment: "Excelente produto!"
 *     responses:
 *       200:
 *         description: Rating saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRatingResponse'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.post('/products/:id/ratings', authMiddleware, (req, res, next) =>
  productController.rate(req, res, next),
);

/**
 * @openapi
 * /products/{id}/ratings:
 *   get:
 *     tags:
 *       - Product Ratings
 *     summary: List product ratings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of ratings
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.get('/products/:id/ratings', authMiddleware, (req, res, next) =>
  productController.listRatings(req, res, next),
);

/**
 * @openapi
 * /products/{id}/favorite:
 *   post:
 *     tags:
 *       - Product Favorites
 *     summary: Toggle product favorite
 *     description: >
 *       Toggles the favorite status of a product for the current user.
 *       If already favorited, removes the favorite. Otherwise, adds it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Favorite toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.post('/products/:id/favorite', authMiddleware, (req, res, next) =>
  productController.toggleFavorite(req, res, next),
);

/**
 * @openapi
 * /products/{id}/questions:
 *   post:
 *     tags:
 *       - Product Questions
 *     summary: Ask a question about a product
 *     description: >
 *       Ask a question about a product. Maximum 1 question per user per product.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *           example:
 *             question: "Essa racao e indicada para caes de porte grande?"
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductQuestionResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: User already asked a question for this product
 */
productRouter.post('/products/:id/questions', authMiddleware, (req, res, next) =>
  productController.askQuestion(req, res, next),
);

/**
 * @openapi
 * /products/{id}/questions:
 *   get:
 *     tags:
 *       - Product Questions
 *     summary: List questions for a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of questions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.get('/products/:id/questions', authMiddleware, (req, res, next) =>
  productController.listQuestions(req, res, next),
);

/**
 * @openapi
 * /products/questions/{questionId}/answer:
 *   post:
 *     tags:
 *       - Product Questions
 *     summary: Answer a product question
 *     description: >
 *       Answer a question. Only the product owner (company) can answer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *           example:
 *             answer: "Sim, e indicada para caes de todos os portes."
 *     responses:
 *       200:
 *         description: Question answered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductQuestionResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Question not found
 */
productRouter.post(
  '/products/questions/:questionId/answer',
  authMiddleware,
  roleMiddleware('COMPANY', 'ADMIN'),
  (req, res, next) => productController.answerQuestion(req, res, next),
);

export { productRouter };

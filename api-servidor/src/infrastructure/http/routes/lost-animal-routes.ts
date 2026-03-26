import { Router } from 'express';
import { lostAnimalController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { uploadLostAnimalMedia } from '../middlewares/upload-middleware';

const lostAnimalRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     LostAnimalMediaResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         mediaType:
 *           type: string
 *           enum: [PHOTO, VIDEO]
 *         url:
 *           type: string
 *         displayOrder:
 *           type: integer
 *     LostAnimalResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tutorId:
 *           type: string
 *           format: uuid
 *         animalId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         state:
 *           type: string
 *           description: Brazilian state abbreviation (e.g. SP, RJ)
 *         city:
 *           type: string
 *         lastSeenLocation:
 *           type: string
 *           nullable: true
 *         lastSeenDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         contactPhone:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [LOST, FOUND]
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LostAnimalMediaResponse'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedLostAnimals:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LostAnimalResponse'
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
 * /lost-animals:
 *   post:
 *     tags:
 *       - Lost Animals
 *     summary: Create a lost animal post
 *     description: >
 *       Creates a new lost animal post with up to 2 photos and 1 video.
 *       Only users with TUTOR role can create posts.
 *       Optionally link a registered animal from the tutor's account.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - state
 *               - city
 *             properties:
 *               animalId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of a registered animal
 *               title:
 *                 type: string
 *                 description: Post title
 *               description:
 *                 type: string
 *                 description: Additional details about the lost animal
 *               state:
 *                 type: string
 *                 description: Brazilian state abbreviation (e.g. SP, RJ)
 *               city:
 *                 type: string
 *                 description: City name
 *               lastSeenLocation:
 *                 type: string
 *                 description: Last known location / address
 *               lastSeenDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the animal was last seen
 *               contactPhone:
 *                 type: string
 *                 description: Contact phone number
 *               files:
 *                 type: array
 *                 description: Up to 2 photos (max 10MB each) and 1 video (max 15s, mp4/mov)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Lost animal post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LostAnimalResponse'
 *       400:
 *         description: Invalid input or media limit exceeded
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
lostAnimalRouter.post(
  '/lost-animals',
  authMiddleware,
  roleMiddleware('TUTOR'),
  uploadLostAnimalMedia,
  (req, res, next) => lostAnimalController.create(req, res, next),
);

/**
 * @openapi
 * /lost-animals:
 *   get:
 *     tags:
 *       - Lost Animals
 *     summary: List lost animal posts (public feed)
 *     description: >
 *       Lists all active lost animal posts with pagination and filters.
 *       Any authenticated user can browse the feed.
 *       Results ordered by most recent first (Instagram-like).
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
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state (e.g. SP, RJ)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (partial match)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [LOST, FOUND]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Paginated list of lost animal posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedLostAnimals'
 *       401:
 *         description: Missing or invalid authorization
 */
lostAnimalRouter.get('/lost-animals', authMiddleware, (req, res, next) =>
  lostAnimalController.list(req, res, next),
);

/**
 * @openapi
 * /lost-animals/mine:
 *   get:
 *     tags:
 *       - Lost Animals
 *     summary: List my lost animal posts
 *     description: >
 *       Lists all lost animal posts created by the authenticated tutor.
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
 *         description: Paginated list of my lost animal posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedLostAnimals'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
lostAnimalRouter.get(
  '/lost-animals/mine',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => lostAnimalController.listMine(req, res, next),
);

/**
 * @openapi
 * /lost-animals/{id}:
 *   get:
 *     tags:
 *       - Lost Animals
 *     summary: Get lost animal post details
 *     description: Returns details of a specific lost animal post including media.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lost animal post ID
 *     responses:
 *       200:
 *         description: Lost animal post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LostAnimalResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Post not found
 */
lostAnimalRouter.get('/lost-animals/:id', authMiddleware, (req, res, next) =>
  lostAnimalController.getById(req, res, next),
);

/**
 * @openapi
 * /lost-animals/{id}:
 *   put:
 *     tags:
 *       - Lost Animals
 *     summary: Update lost animal post
 *     description: >
 *       Updates an existing lost animal post.
 *       Only the tutor who created the post can update it.
 *       If media is provided, it replaces all existing media.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lost animal post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               lastSeenLocation:
 *                 type: string
 *               lastSeenDate:
 *                 type: string
 *                 format: date-time
 *               contactPhone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [LOST, FOUND]
 *           example:
 *             lastSeenLocation: "Av. Paulista, 1500"
 *             description: "Updated - seen near subway station"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LostAnimalResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Post not found
 */
lostAnimalRouter.put(
  '/lost-animals/:id',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => lostAnimalController.update(req, res, next),
);

/**
 * @openapi
 * /lost-animals/{id}:
 *   delete:
 *     tags:
 *       - Lost Animals
 *     summary: Delete lost animal post (soft delete)
 *     description: >
 *       Soft-deletes a lost animal post and its associated media.
 *       Only the tutor who created the post can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lost animal post ID
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Post not found
 */
lostAnimalRouter.delete(
  '/lost-animals/:id',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => lostAnimalController.delete(req, res, next),
);

/**
 * @openapi
 * /lost-animals/{id}/found:
 *   patch:
 *     tags:
 *       - Lost Animals
 *     summary: Mark animal as found
 *     description: >
 *       Shortcut to mark a lost animal post as FOUND.
 *       Only the tutor who created the post can mark it as found.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lost animal post ID
 *     responses:
 *       200:
 *         description: Post marked as found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LostAnimalResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Post not found
 */
lostAnimalRouter.patch(
  '/lost-animals/:id/found',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => lostAnimalController.markAsFound(req, res, next),
);

export { lostAnimalRouter };

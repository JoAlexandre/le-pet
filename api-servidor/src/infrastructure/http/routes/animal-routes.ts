import { Router } from 'express';
import { animalController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { uploadAnimalPhoto } from '../middlewares/upload-middleware';

const animalRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AnimalResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tutorId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         species:
 *           type: string
 *           enum: [DOG, CAT, BIRD, FISH, REPTILE, HORSE, COW, OTHER]
 *         breed:
 *           type: string
 *           nullable: true
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         birthDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         weight:
 *           type: number
 *           nullable: true
 *           description: Weight in kilograms
 *         color:
 *           type: string
 *           nullable: true
 *         microchipNumber:
 *           type: string
 *           nullable: true
 *         photoUrl:
 *           type: string
 *           nullable: true
 *         allergies:
 *           type: string
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedAnimals:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnimalResponse'
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
 * /animals:
 *   post:
 *     tags:
 *       - Animals
 *     summary: Register a new animal
 *     description: >
 *       Registers a new animal for the authenticated tutor.
 *       Only users with TUTOR role can register animals.
 *       There is a limit of 50 animals per tutor in the MVP.
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
 *               - species
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 description: Animal name
 *               species:
 *                 type: string
 *                 enum: [DOG, CAT, BIRD, FISH, REPTILE, HORSE, COW, OTHER]
 *               breed:
 *                 type: string
 *                 description: Breed (optional)
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Birth date in ISO format (YYYY-MM-DD)
 *               weight:
 *                 type: number
 *                 description: Weight in kilograms
 *               color:
 *                 type: string
 *               microchipNumber:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               allergies:
 *                 type: string
 *                 description: Known allergies
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *           examples:
 *             dog:
 *               summary: Dog
 *               value:
 *                 name: "Rex"
 *                 species: "DOG"
 *                 breed: "Golden Retriever"
 *                 gender: "MALE"
 *                 birthDate: "2022-03-15"
 *                 weight: 32.5
 *                 color: "Golden"
 *                 microchipNumber: "985112345678901"
 *                 allergies: "Chicken"
 *             cat:
 *               summary: Cat
 *               value:
 *                 name: "Mia"
 *                 species: "CAT"
 *                 breed: "Siamese"
 *                 gender: "FEMALE"
 *                 birthDate: "2023-06-01"
 *                 weight: 4.2
 *                 color: "Cream"
 *             bird:
 *               summary: Bird
 *               value:
 *                 name: "Piu"
 *                 species: "BIRD"
 *                 gender: "MALE"
 *                 color: "Green"
 *     responses:
 *       201:
 *         description: Animal registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponse'
 *       400:
 *         description: Invalid input (missing fields, invalid species/gender)
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions or animal limit exceeded
 */
animalRouter.post('/animals', authMiddleware, roleMiddleware('TUTOR'), uploadAnimalPhoto, (req, res, next) =>
  animalController.create(req, res, next),
);

/**
 * @openapi
 * /animals:
 *   get:
 *     tags:
 *       - Animals
 *     summary: List my animals
 *     description: >
 *       Lists all active animals belonging to the authenticated tutor with pagination.
 *       Only users with TUTOR role can list their animals.
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
 *         description: List of animals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAnimals'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - insufficient permissions
 */
animalRouter.get('/animals', authMiddleware, roleMiddleware('TUTOR'), (req, res, next) =>
  animalController.list(req, res, next),
);

/**
 * @openapi
 * /animals/{id}:
 *   get:
 *     tags:
 *       - Animals
 *     summary: Get animal details
 *     description: >
 *       Returns details of a specific animal.
 *       Only the tutor who owns the animal can view it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *     responses:
 *       200:
 *         description: Animal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Animal not found
 */
animalRouter.get('/animals/:id', authMiddleware, roleMiddleware('TUTOR'), (req, res, next) =>
  animalController.getById(req, res, next),
);

/**
 * @openapi
 * /animals/{id}:
 *   put:
 *     tags:
 *       - Animals
 *     summary: Update animal
 *     description: >
 *       Updates an existing animal. Only the tutor who owns the animal can update it.
 *       All fields are optional - only provided fields will be updated.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *                 enum: [DOG, CAT, BIRD, FISH, REPTILE, HORSE, COW, OTHER]
 *               breed:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               birthDate:
 *                 type: string
 *                 format: date
 *               weight:
 *                 type: number
 *               color:
 *                 type: string
 *               microchipNumber:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               allergies:
 *                 type: string
 *               notes:
 *                 type: string
 *           example:
 *             weight: 33.0
 *             allergies: "Chicken, Beef"
 *             notes: "Updated vaccination schedule"
 *     responses:
 *       200:
 *         description: Animal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Animal not found
 */
animalRouter.put('/animals/:id', authMiddleware, roleMiddleware('TUTOR'), uploadAnimalPhoto, (req, res, next) =>
  animalController.update(req, res, next),
);

/**
 * @openapi
 * /animals/{id}:
 *   delete:
 *     tags:
 *       - Animals
 *     summary: Remove animal (soft delete)
 *     description: >
 *       Soft-deletes an animal (sets deletedAt timestamp).
 *       Only the tutor who owns the animal can remove it.
 *       The animal data is preserved but no longer visible in listings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *     responses:
 *       204:
 *         description: Animal removed successfully
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Animal not found
 */
animalRouter.delete('/animals/:id', authMiddleware, roleMiddleware('TUTOR'), (req, res, next) =>
  animalController.delete(req, res, next),
);

/**
 * @openapi
 * /animals/{id}/photo:
 *   post:
 *     tags:
 *       - Animals
 *     summary: Upload or replace animal photo
 *     description: >
 *       Uploads a photo for the animal, replacing any existing photo.
 *       Accepts multipart/form-data with a single image file in the `photo` field.
 *       Only the tutor who owns the animal can update its photo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg or png, max 10MB)
 *     responses:
 *       200:
 *         description: Photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponse'
 *       400:
 *         description: No file provided or invalid file type/size
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: Animal not found
 */
animalRouter.post(
  '/animals/:id/photo',
  authMiddleware,
  roleMiddleware('TUTOR'),
  uploadAnimalPhoto,
  (req, res, next) => animalController.uploadPhoto(req, res, next),
);

export { animalRouter };

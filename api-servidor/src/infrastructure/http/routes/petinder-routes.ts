import { Router } from 'express';
import { petinderController, quotaService } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { requireFeature } from '../middlewares/require-feature-middleware';

const petinderRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     PetinderProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         animalId:
 *           type: string
 *           format: uuid
 *         animalName:
 *           type: string
 *         species:
 *           type: string
 *         breed:
 *           type: string
 *           nullable: true
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         photoUrl:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         hasLikedYou:
 *           type: boolean
 *           description: Whether this animal has already liked yours (only in recommendations)
 *         createdAt:
 *           type: string
 *           format: date-time
 *     SwipeResponse:
 *       type: object
 *       properties:
 *         swipeId:
 *           type: string
 *           format: uuid
 *         isLike:
 *           type: boolean
 *         isMatch:
 *           type: boolean
 *         matchId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *     PetinderMatchResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         animalOneId:
 *           type: string
 *           format: uuid
 *         animalTwoId:
 *           type: string
 *           format: uuid
 *         animalOneName:
 *           type: string
 *         animalTwoName:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PetinderMessageResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         matchId:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PaginatedPetinderProfiles:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetinderProfileResponse'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     PaginatedPetinderMatches:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetinderMatchResponse'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     PaginatedPetinderMessages:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetinderMessageResponse'
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
 * /petinder/profiles:
 *   post:
 *     tags:
 *       - PeTinder
 *     summary: Enable PeTinder for an animal
 *     description: >
 *       Enables an animal for PeTinder breeding matching.
 *       Only users with TUTOR role can enable their own animals.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalId
 *             properties:
 *               animalId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the animal to enable
 *               description:
 *                 type: string
 *                 description: Optional description for the PeTinder profile
 *           examples:
 *             basic:
 *               summary: Enable with description
 *               value:
 *                 animalId: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: "Looking for a partner for my golden retriever"
 *     responses:
 *       201:
 *         description: PeTinder enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetinderProfileResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied
 *       409:
 *         description: PeTinder already enabled for this animal
 */
petinderRouter.post(
  '/petinder/profiles',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.enable(req, res, next),
);

/**
 * @openapi
 * /petinder/profiles/{animalId}:
 *   get:
 *     tags:
 *       - PeTinder
 *     summary: Get PeTinder profile for an animal
 *     description: Returns the PeTinder profile for the specified animal.
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
 *     responses:
 *       200:
 *         description: PeTinder profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetinderProfileResponse'
 *       404:
 *         description: Profile not found
 */
petinderRouter.get(
  '/petinder/profiles/:animalId',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.getProfile(req, res, next),
);

/**
 * @openapi
 * /petinder/profiles/{animalId}:
 *   delete:
 *     tags:
 *       - PeTinder
 *     summary: Disable PeTinder for an animal
 *     description: >
 *       Disables an animal from PeTinder. Only the tutor who owns the animal can disable it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID to disable
 *     responses:
 *       204:
 *         description: PeTinder disabled successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: PeTinder not enabled for this animal
 */
petinderRouter.delete(
  '/petinder/profiles/:animalId',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.disable(req, res, next),
);

/**
 * @openapi
 * /petinder/recommendations/{animalId}:
 *   get:
 *     tags:
 *       - PeTinder
 *     summary: Get PeTinder recommendations
 *     description: >
 *       Returns a paginated list of PeTinder profiles from animals of the same species
 *       that have not been swiped yet. Excludes the tutor's own animals.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID to get recommendations for
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
 *         description: List of recommended PeTinder profiles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPetinderProfiles'
 *       400:
 *         description: PeTinder not enabled for this animal
 *       403:
 *         description: Access denied
 *       404:
 *         description: Animal not found
 */
petinderRouter.get(
  '/petinder/recommendations/:animalId',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.getRecommendations(req, res, next),
);

/**
 * @openapi
 * /petinder/swipe:
 *   post:
 *     tags:
 *       - PeTinder
 *     summary: Swipe (like/pass) on an animal
 *     description: >
 *       Records a like or pass on an animal. If both animals have liked each other,
 *       a match is created and chat is enabled between the tutors.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - swiperAnimalId
 *               - targetAnimalId
 *               - isLike
 *             properties:
 *               swiperAnimalId:
 *                 type: string
 *                 format: uuid
 *                 description: Your animal's ID
 *               targetAnimalId:
 *                 type: string
 *                 format: uuid
 *                 description: Target animal's ID
 *               isLike:
 *                 type: boolean
 *                 description: true = like, false = pass
 *           examples:
 *             like:
 *               summary: Like an animal
 *               value:
 *                 swiperAnimalId: "550e8400-e29b-41d4-a716-446655440000"
 *                 targetAnimalId: "660e8400-e29b-41d4-a716-446655440000"
 *                 isLike: true
 *             pass:
 *               summary: Pass on an animal
 *               value:
 *                 swiperAnimalId: "550e8400-e29b-41d4-a716-446655440000"
 *                 targetAnimalId: "660e8400-e29b-41d4-a716-446655440000"
 *                 isLike: false
 *     responses:
 *       201:
 *         description: Swipe recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SwipeResponse'
 *       400:
 *         description: Invalid input or species mismatch
 *       403:
 *         description: Access denied
 *       409:
 *         description: Already swiped on this animal
 */
petinderRouter.post(
  '/petinder/swipe',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.swipe(req, res, next),
);

/**
 * @openapi
 * /petinder/matches/{animalId}:
 *   get:
 *     tags:
 *       - PeTinder
 *     summary: List PeTinder matches for an animal
 *     description: >
 *       Returns a paginated list of active matches for the specified animal.
 *       Only the tutor who owns the animal can view matches.
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
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPetinderMatches'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Animal not found
 */
petinderRouter.get(
  '/petinder/matches/:animalId',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.listMatches(req, res, next),
);

/**
 * @openapi
 * /petinder/matches/{matchId}/messages:
 *   get:
 *     tags:
 *       - PeTinder
 *     summary: List messages for a match
 *     description: >
 *       Returns a paginated list of messages for a match.
 *       Only participants of the match can view messages.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Match ID
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
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPetinderMessages'
 *       403:
 *         description: Not a participant of this match
 *       404:
 *         description: Match not found
 */
petinderRouter.get(
  '/petinder/matches/:matchId/messages',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.listMessages(req, res, next),
);

/**
 * @openapi
 * /petinder/matches/{matchId}/messages:
 *   post:
 *     tags:
 *       - PeTinder
 *     summary: Send a message in a match chat
 *     description: >
 *       Sends a message to the match chat. Only participants of the match can send messages.
 *       The match must be active.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Message content
 *           examples:
 *             basic:
 *               summary: Send a message
 *               value:
 *                 content: "Hi! I think our dogs would be a great match!"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetinderMessageResponse'
 *       400:
 *         description: Empty content or match not active
 *       403:
 *         description: Not a participant of this match
 *       404:
 *         description: Match not found
 */
petinderRouter.post(
  '/petinder/matches/:matchId/messages',
  authMiddleware,
  roleMiddleware('TUTOR'),
  requireFeature(quotaService, 'canUsePetinder'),
  (req, res, next) => petinderController.sendMessage(req, res, next),
);

export { petinderRouter };

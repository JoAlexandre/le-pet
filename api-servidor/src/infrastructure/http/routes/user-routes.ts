import { Router } from 'express';
import { userController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { validationMiddleware } from '../middlewares/validation-middleware';

const userRouter = Router();

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Updates name and/or phone of the authenticated user. Only the user themselves can update their own profile.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
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
 *           example:
 *             name: "Jose Alexandre"
 *             phone: "65992788066"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *                   nullable: true
 *                 specialtyType:
 *                   type: string
 *                   nullable: true
 *                 crmvStatus:
 *                   type: string
 *                   nullable: true
 *                 phone:
 *                   type: string
 *                   nullable: true
 *                 isActive:
 *                   type: boolean
 *                 isOnboardingComplete:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - not the owner
 *       404:
 *         description: User not found
 */
userRouter.put(
  '/users/:id',
  authMiddleware,
  validationMiddleware({
    name: { required: false, type: 'string' },
    phone: { required: false, type: 'string' },
  }),
  (req, res, next) => userController.update(req, res, next),
);

export { userRouter };

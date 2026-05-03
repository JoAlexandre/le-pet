import { Router } from 'express';
import { authController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { validationMiddleware } from '../middlewares/validation-middleware';

const authRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             role:
 *               type: string
 *               nullable: true
 *               enum: [ADMIN, TUTOR, COMPANY, PROFESSIONAL]
 *             specialtyType:
 *               type: string
 *               nullable: true
 *               enum: [VETERINARIAN, GROOMER, BATHER, TRAINER, OTHER]
 *             crmvStatus:
 *               type: string
 *               nullable: true
 *               enum: [PENDING, VERIFIED, REJECTED]
 *             phone:
 *               type: string
 *               nullable: true
 *             isActive:
 *               type: boolean
 *             isOnboardingComplete:
 *               type: boolean
 *         token:
 *           type: string
 *         refreshToken:
 *           type: string
 *         isOnboardingComplete:
 *           type: boolean
 */

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login/Register via Google
 *     description: Validates a Google idToken and creates or logs in the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google OAuth idToken
 *           example:
 *             idToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.google-id-token-here"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid OAuth token
 *       409:
 *         description: Provider mismatch - email registered with different provider
 */
authRouter.post(
  '/auth/google',
  validationMiddleware({ idToken: { required: true, type: 'string' } }),
  (req, res, next) => authController.googleAuth(req, res, next),
);

/**
 * @openapi
 * /auth/apple:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login/Register via Apple
 *     description: Validates an Apple idToken and creates or logs in the user. firstName and lastName are only sent by Apple on the first login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Apple OAuth idToken
 *               firstName:
 *                 type: string
 *                 description: User's first name (only provided on first Apple login)
 *               lastName:
 *                 type: string
 *                 description: User's last name (only provided on first Apple login)
 *           example:
 *             idToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.apple-id-token-here"
 *             firstName: "Maria"
 *             lastName: "Silva"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid OAuth token
 *       409:
 *         description: Provider mismatch
 */
authRouter.post(
  '/auth/apple',
  validationMiddleware({ idToken: { required: true, type: 'string' } }),
  (req, res, next) => authController.appleAuth(req, res, next),
);

/**
 * @openapi
 * /auth/microsoft:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login/Register via Microsoft
 *     description: Validates a Microsoft idToken and creates or logs in the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Microsoft OAuth idToken
 *           example:
 *             idToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.microsoft-id-token-here"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid OAuth token
 *       409:
 *         description: Provider mismatch
 */
authRouter.post(
  '/auth/microsoft',
  validationMiddleware({ idToken: { required: true, type: 'string' } }),
  (req, res, next) => authController.microsoftAuth(req, res, next),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login via email/password (employees only)
 *     description: Authenticates a user created by a company (authProvider=EMAIL). Not for self-registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           example:
 *             email: "funcionario@petshop.com"
 *             password: "Senha123"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Account uses OAuth - cannot login with email/password
 *       401:
 *         description: Invalid credentials
 */
authRouter.post(
  '/auth/login',
  validationMiddleware({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
  }),
  (req, res, next) => authController.emailLogin(req, res, next),
);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh JWT token
 *     description: Generates a new JWT using a valid refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token-here"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid or expired refresh token
 */
authRouter.post(
  '/auth/refresh-token',
  validationMiddleware({ refreshToken: { required: true, type: 'string' } }),
  (req, res, next) => authController.refreshToken(req, res, next),
);

/**
 * @openapi
 * /auth/onboarding:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Complete onboarding
 *     description: Sets the user's role and additional data after first OAuth login
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TUTOR, COMPANY, PROFESSIONAL]
 *               specialtyType:
 *                 type: string
 *                 enum: [VETERINARIAN, GROOMER, BATHER, TRAINER, OTHER]
 *                 description: Required when role is PROFESSIONAL
 *               crmvNumber:
 *                 type: string
 *                 description: Required when specialtyType is VETERINARIAN
 *               crmvState:
 *                 type: string
 *                 description: Required when specialtyType is VETERINARIAN (2-letter state code)
 *               phone:
 *                 type: string
 *           examples:
 *             tutor:
 *               summary: Onboarding as Tutor
 *               value:
 *                 role: "TUTOR"
 *                 phone: "11999998888"
 *             company:
 *               summary: Onboarding as Company
 *               value:
 *                 role: "COMPANY"
 *                 phone: "11999997777"
 *             professional-vet:
 *               summary: Onboarding as Veterinarian
 *               value:
 *                 role: "PROFESSIONAL"
 *                 specialtyType: "VETERINARIAN"
 *                 crmvNumber: "12345"
 *                 crmvState: "SP"
 *                 phone: "11999996666"
 *             professional-groomer:
 *               summary: Onboarding as Groomer
 *               value:
 *                 role: "PROFESSIONAL"
 *                 specialtyType: "GROOMER"
 *                 phone: "11999995555"
 *             admin:
 *               summary: Onboarding as Admin
 *               value:
 *                 role: "ADMIN"
 *                 phone: "11999994444"
 *     responses:
 *       200:
 *         description: Onboarding completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid data or onboarding already completed
 *       401:
 *         description: Unauthorized
 */
authRouter.post(
  '/auth/onboarding',
  authMiddleware,
  validationMiddleware({
    role: { required: true, type: 'string', enum: ['ADMIN', 'TUTOR', 'COMPANY', 'PROFESSIONAL'] },
  }),
  (req, res, next) => authController.completeOnboarding(req, res, next),
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout
 *     description: Revokes all refresh tokens for the authenticated user. The current access token remains valid until it expires naturally.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/auth/logout', authMiddleware, (req, res, next) =>
  authController.logout(req, res, next),
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user
 *     description: Returns the authenticated user's profile data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
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
 *                 isOnboardingComplete:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
authRouter.get('/auth/me', authMiddleware, (req, res, next) => authController.me(req, res, next));

/**
 * @openapi
 * /auth/change-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     summary: Change password
 *     description: Changes the password for email-authenticated users. Not available for OAuth accounts.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password (min 8 chars, 1 uppercase, 1 number)
 *           example:
 *             currentPassword: "OldPass123"
 *             newPassword: "NewPass456"
 *     responses:
 *       204:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or password does not meet requirements
 *       401:
 *         description: Unauthorized
 */
authRouter.patch(
  '/auth/change-password',
  authMiddleware,
  validationMiddleware({
    newPassword: { required: true, type: 'string' },
  }),
  (req, res, next) => authController.changePassword(req, res, next),
);

export { authRouter };

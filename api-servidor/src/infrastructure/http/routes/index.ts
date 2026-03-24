import { Router } from 'express';
import { healthRouter } from './health-routes';
import { authRouter } from './auth-routes';
import { companyRouter } from './company-routes';
import { professionalRouter } from './professional-routes';
import { animalRouter } from './animal-routes';
import { webRouter } from './web-routes';
import { docsRouter } from './docs-routes';
import { lgpdLogRouter } from './lgpd-log-routes';

const apiPrefix = process.env.API_PREFIX || '/api/v1';
const router = Router();

// Paginas web (login, onboarding, logout)
router.use(apiPrefix, webRouter);

// API routes
router.use(apiPrefix, healthRouter);
router.use(apiPrefix, authRouter);
router.use(apiPrefix, companyRouter);
router.use(apiPrefix, professionalRouter);
router.use(apiPrefix, animalRouter);
router.use(apiPrefix, lgpdLogRouter);

// Documentacao
router.use(apiPrefix, docsRouter);

export { router };

import { Router } from 'express';
import { healthRouter } from './health-routes';
import { authRouter } from './auth-routes';
import { companyRouter } from './company-routes';
import { professionalRouter } from './professional-routes';
import { animalRouter } from './animal-routes';
import { vaccineRouter } from './vaccine-routes';
import { serviceRouter } from './service-routes';
import { productRouter } from './product-routes';
import { scheduleRouter } from './schedule-routes';
import { appointmentRouter } from './appointment-routes';
import { lostAnimalRouter } from './lost-animal-routes';
import { petinderRouter } from './petinder-routes';
import { medicalRecordRouter } from './medical-record-routes';
import { planRouter } from './plan-routes';
import { subscriptionRouter } from './subscription-routes';
import { stripeWebhookRouter } from './stripe-webhook-routes';
import { webRouter } from './web-routes';
import { docsRouter } from './docs-routes';
import { lgpdLogRouter } from './lgpd-log-routes';
import { userRouter } from './user-routes';

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
router.use(apiPrefix, vaccineRouter);
router.use(apiPrefix, serviceRouter);
router.use(apiPrefix, productRouter);
router.use(apiPrefix, scheduleRouter);
router.use(apiPrefix, appointmentRouter);
router.use(apiPrefix, lostAnimalRouter);
router.use(apiPrefix, petinderRouter);
router.use(apiPrefix, medicalRecordRouter);
router.use(apiPrefix, planRouter);
router.use(apiPrefix, subscriptionRouter);
router.use(apiPrefix, stripeWebhookRouter);
router.use(apiPrefix, lgpdLogRouter);
router.use(apiPrefix, userRouter);

// Documentacao
router.use(apiPrefix, docsRouter);

export { router };

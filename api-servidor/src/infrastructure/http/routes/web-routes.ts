import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { authController } from '../dependencies';

const webRouter = Router();

function requireSession(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.userId) {
    next();
    return;
  }
  res.redirect('/login');
}

webRouter.get('/auth/google', (req, res, next) => authController.googleWebInit(req, res, next));

webRouter.get('/auth/google/callback', (req, res, next) =>
  authController.googleWebCallback(req, res, next),
);

webRouter.get('/onboarding', requireSession, (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/onboarding.html'));
});

webRouter.get('/onboarding/complete', requireSession, (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/onboarding-complete.html'));
});

export { webRouter, requireSession };

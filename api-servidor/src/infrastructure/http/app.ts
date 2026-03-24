import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import { router } from './routes';
import { errorHandler, lgpdMiddleware } from './middlewares';
import { SequelizeSessionStore } from './session/sequelize-session-store';
import { config } from '../../shared/config';
import { logger } from '../../shared/logger';
import path from 'path';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.originalUrl}`);
      next();
    });

    this.app.use(
      session({
        store: new SequelizeSessionStore(),
        secret: config.jwt.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: config.nodeEnv === 'production',
          maxAge: 24 * 60 * 60 * 1000,
        },
      }),
    );
  }

  private setupRoutes(): void {
    this.app.get('/', (_req, res) => {
      res.redirect('/login');
    });

    this.app.get('/login', (req, res) => {
      if (req.session?.userId && req.session?.isOnboardingComplete) {
        res.redirect('/api/v1/docs');
        return;
      }
      res.sendFile(path.resolve(__dirname, './views/login.html'));
    });

    this.app.get('/logout', (req, res) => {
      req.session.destroy(() => {
        res.redirect('/login');
      });
    });

    this.app.use(lgpdMiddleware);
    this.app.use(router);
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getApp(): Application {
    return this.app;
  }
}

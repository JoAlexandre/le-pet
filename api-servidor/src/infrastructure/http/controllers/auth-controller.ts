import { Request, Response, NextFunction } from 'express';
import { GoogleAuthUseCase } from '../../../application/use-cases/auth/google-auth-use-case';
import { GoogleWebAuthUseCase } from '../../../application/use-cases/auth/google-web-auth-use-case';
import { AppleAuthUseCase } from '../../../application/use-cases/auth/apple-auth-use-case';
import { MicrosoftAuthUseCase } from '../../../application/use-cases/auth/microsoft-auth-use-case';
import { EmailLoginUseCase } from '../../../application/use-cases/auth/email-login-use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token-use-case';
import { CompleteOnboardingUseCase } from '../../../application/use-cases/auth/complete-onboarding-use-case';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout-use-case';
import { GetCurrentUserUseCase } from '../../../application/use-cases/auth/get-current-user-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { Role, SpecialtyType } from '@domain/enums';

export class AuthController {
  constructor(
    private googleAuthUseCase: GoogleAuthUseCase,
    private googleWebAuthUseCase: GoogleWebAuthUseCase,
    private appleAuthUseCase: AppleAuthUseCase,
    private microsoftAuthUseCase: MicrosoftAuthUseCase,
    private emailLoginUseCase: EmailLoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private completeOnboardingUseCase: CompleteOnboardingUseCase,
    private logoutUseCase: LogoutUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as { idToken: string };
      const result = await this.googleAuthUseCase.execute({
        idToken: body.idToken,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  googleWebInit(_req: Request, res: Response, next: NextFunction): void {
    try {
      const authUrl = this.googleWebAuthUseCase.generateAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  }

  async googleWebCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = req.query.code as string;
      if (!code) {
        res.status(400).json({ error: 'Missing authorization code' });
        return;
      }

      const result = await this.googleWebAuthUseCase.handleCallback(code);

      req.session.userId = result.user.id;
      req.session.email = result.user.email;
      req.session.role = result.user.role;
      req.session.isOnboardingComplete = result.isOnboardingComplete;
      req.session.token = result.token;
      req.session.refreshToken = result.refreshToken;

      if (result.isOnboardingComplete) {
        res.redirect('/api/v1/docs');
        return;
      }

      res.redirect(
        `/api/v1/onboarding?token=${encodeURIComponent(result.token)}` +
          `&refreshToken=${encodeURIComponent(result.refreshToken)}`,
      );
    } catch (error) {
      next(error);
    }
  }

  async appleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as { idToken: string; firstName: string; lastName: string };
      const result = await this.appleAuthUseCase.execute({
        idToken: body.idToken,
        firstName: body.firstName,
        lastName: body.lastName,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async microsoftAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as { idToken: string };
      const result = await this.microsoftAuthUseCase.execute({
        idToken: body.idToken,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async emailLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as { email: string; password: string };
      const result = await this.emailLoginUseCase.execute({
        email: body.email,
        password: body.password,
      });

      req.session.userId = result.user.id;
      req.session.email = result.user.email;
      req.session.role = result.user.role;
      req.session.isOnboardingComplete = result.isOnboardingComplete;
      req.session.token = result.token;
      req.session.refreshToken = result.refreshToken;

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as { refreshToken: string };
      const result = await this.refreshTokenUseCase.execute({
        refreshToken: body.refreshToken,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async completeOnboarding(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body as {
        role: string;
        specialtyType: string;
        crmvNumber: string;
        crmvState: string;
        phone: string;
      };
      const result = await this.completeOnboardingUseCase.execute(req.user!.sub, {
        role: body.role as Role,
        specialtyType: body.specialtyType as SpecialtyType,
        crmvNumber: body.crmvNumber,
        crmvState: body.crmvState,
        phone: body.phone,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.logoutUseCase.execute(req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getCurrentUserUseCase.execute(req.user!.sub);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

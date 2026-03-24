import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    email: string;
    role: string | null;
    isOnboardingComplete: boolean;
    token: string;
    refreshToken: string;
  }
}

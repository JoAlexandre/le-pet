import appleSignin from 'apple-signin-auth';
import { OAuthProvider, OAuthUserData } from '../../../application/interfaces/oauth-provider';
import { config } from '../../../shared/config';
import { logger } from '../../../shared/logger';

export class AppleOAuthProvider implements OAuthProvider {
  async validateToken(idToken: string): Promise<OAuthUserData> {
    // audience pode ser string ou array - passa os dois formatos para compatibilidade
    const clientId = config.apple.clientId;

    let payload: Awaited<ReturnType<typeof appleSignin.verifyIdToken>>;
    try {
      payload = await appleSignin.verifyIdToken(idToken, {
        audience: clientId,
        ignoreExpiration: false,
      });
    } catch (firstErr) {
      logger.warn('Apple verifyIdToken falhou', {
        firstError: (firstErr as Error).message,
        clientId,
      });
      throw firstErr;
    }

    if (!payload || !payload.sub) {
      throw new Error('Invalid Apple token payload');
    }

    return {
      email: payload.email || '',
      name: payload.email || '',
      providerId: payload.sub,
    };
  }
}

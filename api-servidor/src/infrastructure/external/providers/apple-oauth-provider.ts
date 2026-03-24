import appleSignin from 'apple-signin-auth';
import { OAuthProvider, OAuthUserData } from '../../../application/interfaces/oauth-provider';
import { config } from '../../../shared/config';

export class AppleOAuthProvider implements OAuthProvider {
  async validateToken(idToken: string): Promise<OAuthUserData> {
    const payload = await appleSignin.verifyIdToken(idToken, {
      audience: config.apple.clientId,
      ignoreExpiration: false,
    });

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

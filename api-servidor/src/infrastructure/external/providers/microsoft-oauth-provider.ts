import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { OAuthProvider, OAuthUserData } from '../../../application/interfaces/oauth-provider';
import { config } from '../../../shared/config';

export class MicrosoftOAuthProvider implements OAuthProvider {
  private client: jwksClient.JwksClient;

  constructor() {
    const tenantId = config.microsoft.tenantId;
    this.client = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
      cache: true,
      rateLimit: true,
    });
  }

  async validateToken(idToken: string): Promise<OAuthUserData> {
    const decodedHeader = jwt.decode(idToken, { complete: true });

    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error('Invalid Microsoft token');
    }

    const key = await this.client.getSigningKey(decodedHeader.header.kid);
    const signingKey = key.getPublicKey();

    const payload = jwt.verify(idToken, signingKey, {
      audience: config.microsoft.clientId,
      issuer: `https://login.microsoftonline.com/${config.microsoft.tenantId}/v2.0`,
    }) as jwt.JwtPayload & {
      email?: string;
      preferred_username?: string;
      name?: string;
    };

    if (!payload || !payload.sub) {
      throw new Error('Invalid Microsoft token payload');
    }

    const email = payload.email || payload.preferred_username || '';
    const name = payload.name || email;

    return {
      email,
      name,
      providerId: payload.sub,
    };
  }
}

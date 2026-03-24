import { OAuth2Client } from 'google-auth-library';
import { OAuthProvider, OAuthUserData } from '../../../application/interfaces/oauth-provider';
import { config } from '../../../shared/config';

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export class GoogleOAuthProvider implements OAuthProvider {
  private client: OAuth2Client;
  private webClient: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(config.google.clientId);
    this.webClient = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri,
    );
  }

  async validateToken(idToken: string): Promise<OAuthUserData> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    return {
      email: payload.email,
      name: payload.name || payload.email,
      providerId: payload.sub,
    };
  }

  generateAuthUrl(): string {
    return this.webClient.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    });
  }

  async exchangeCode(code: string): Promise<OAuthUserData> {
    const { tokens } = await this.webClient.getToken(code);
    this.webClient.setCredentials(tokens);

    const idToken = tokens.id_token;
    if (!idToken) {
      throw new Error('No id_token received from Google');
    }

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    return {
      email: payload.email,
      name: payload.name || payload.email,
      providerId: payload.sub,
    };
  }
}

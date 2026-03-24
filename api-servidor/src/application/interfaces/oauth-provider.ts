export interface OAuthUserData {
  email: string;
  name: string;
  providerId: string;
}

export interface OAuthProvider {
  validateToken(idToken: string): Promise<OAuthUserData>;
  generateAuthUrl?(): string;
  exchangeCode?(code: string): Promise<OAuthUserData>;
}

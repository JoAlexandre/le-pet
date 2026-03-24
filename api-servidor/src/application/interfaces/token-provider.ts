export interface TokenPayload {
  sub: string;
  role?: string | null;
  specialtyType?: string | null;
  crmvStatus?: string | null;
}

export interface TokenProvider {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}

import jwt from 'jsonwebtoken';
import { TokenProvider, TokenPayload } from '../../../application/interfaces/token-provider';
import { config } from '../../../shared/config';

export class JwtTokenProvider implements TokenProvider {
  generate(payload: TokenPayload): string {
    return jwt.sign(
      {
        sub: payload.sub,
        role: payload.role,
        specialtyType: payload.specialtyType,
        crmvStatus: payload.crmvStatus,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
    );
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload & {
      role?: string;
      specialtyType?: string;
      crmvStatus?: string;
    };
    return {
      sub: decoded.sub as string,
      role: decoded.role || null,
      specialtyType: decoded.specialtyType || null,
      crmvStatus: decoded.crmvStatus || null,
    };
  }
}

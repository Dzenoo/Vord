import { Injectable } from '@nestjs/common';

import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

const cookieExtractor = (req: any): string | null => {
  return req?.cookies?.access_token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}

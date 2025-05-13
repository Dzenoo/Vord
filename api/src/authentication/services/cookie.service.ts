import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  readonly isSecure: boolean;

  constructor() {
    this.isSecure = process.env.NODE_ENV === 'production';
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isSecure,
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isSecure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.isSecure,
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.isSecure,
      sameSite: 'lax',
    });
  }
}

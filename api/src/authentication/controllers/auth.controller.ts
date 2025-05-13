import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { GoogleOAuthGuard } from '../guards/google-oauth.guard';

import { GoogleAuthService } from '../services/google-auth.service';
import { UserService } from '@/models/user/user.service';
import { TokenService } from '../services/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.googleAuthService.googleAuth(req);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'lax',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
      });

      res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (error) {
      const message = encodeURIComponent(error.message);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${message}`);
    }
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      const { accessToken, refreshToken: newRefreshToken } =
        await this.tokenService.generateTokens({
          _id: payload._id,
          email: payload.email,
        });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'lax',
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      return res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {}
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Get('/csrf-token')
  getCsrfToken(@Req() req: any) {
    return { csrfToken: req.csrfToken };
  }
}

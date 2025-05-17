import {
  Body,
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
import { TokenService } from '../services/token.service';
import { CookieService } from '../services/cookie.service';
import { MagicCodeService } from '@/models/magic-code/magic-code.service';
import { UserService } from '@/models/user/user.service';
import { MailService } from '@/common/modules/email/mail.service';
import { generateUsername } from '@/common/utils';

import { MagicRequestDto, MagicVerifyDto } from '../dto/magic.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly magicCodeService: MagicCodeService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly mailService: MailService,
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

      this.cookieService.setAuthCookies(res, accessToken, refreshToken);

      res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (error) {
      const message = encodeURIComponent(error.message);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${message}`);
    }
  }

  @Post('magic/request')
  async requestCode(@Body() body: MagicRequestDto) {
    const { email } = body;

    const code = await this.magicCodeService.generateCode(email);

    await this.mailService.sendMail(
      email,
      `Your confirmation code: ${code}`,
      'confirm-email',
      {
        code: code,
        year: '2025',
      },
    );

    return { message: 'Magic code sent to email' };
  }

  @Post('magic/verify')
  async verifyCode(@Body() body: MagicVerifyDto, @Res() res: Response) {
    const { email, code } = body;

    await this.magicCodeService.verifyCode(email, code);

    let user = await this.userService.findOne({ email });
    if (!user)
      user = await this.userService.createOne({
        email,
        username: generateUsername(),
      });
    if (!user)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'User could not be created' });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        _id: user._id.toString(),
        email: user.email,
      });

    this.cookieService.setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged in successfully' });
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

      this.cookieService.setAuthCookies(res, accessToken, newRefreshToken);

      return res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {}
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    this.cookieService.clearAuthCookies(res);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: any) {
    return { csrfToken: req.csrfToken };
  }
}

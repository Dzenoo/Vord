import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '@/models/user/user.service';
import { TokenService } from './token.service';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class GoogleAuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async googleAuth(req: any) {
    const { email } = req.user;

    const existingUser = await this.userService.findOne({ email });

    if (existingUser) {
      return this.googleSignIn(req);
    } else {
      return this.googleSignUp(req);
    }
  }

  private async googleSignUp(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email, firstName } = req.user;

    const existingUser = await this.userService.findOne({ email });

    if (existingUser) {
      throw new UnauthorizedException('User already exists, please login');
    }

    const newUser = await this.userService.createOne({
      email,
      isGoogleAccount: true,
      username: firstName,
    });

    if (!newUser) {
      throw new UnauthorizedException('Failed to create user');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        _id: newUser._id.toString(),
        email: newUser.email,
      });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.findAndUpdateOne(
      { _id: newUser._id },
      { refreshToken: hashedRefreshToken },
    );

    return {
      message: 'User created successfully',
      accessToken,
      refreshToken,
    };
  }

  private async googleSignIn(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email } = req.user;

    const existingUser = await this.userService.findOne({ email });

    if (!existingUser) {
      throw new UnauthorizedException('User does not exist, please sign up');
    }

    if (!existingUser.isGoogleAccount) {
      throw new UnauthorizedException('Please use your email to login');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        _id: existingUser._id.toString(),
        email: existingUser.email,
      });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.findAndUpdateOne(
      { _id: existingUser._id },
      { refreshToken: hashedRefreshToken },
    );

    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
    };
  }
}

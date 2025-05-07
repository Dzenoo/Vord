import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/models/user/user.service';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateTokens(user: { _id: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        { expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        { expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const { _id, email } = decoded;

      const user = await this.userService.findOne({ _id, email });
      if (!user || !user.refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new Error('Invalid refresh token');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}

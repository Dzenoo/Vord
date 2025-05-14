import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { randomBytes } from 'crypto';

import { MagicCode } from '@/models/user/schema/magic-code.schema';

@Injectable()
export class MagicCodeService {
  constructor(
    @InjectModel(MagicCode.name)
    private readonly magicCodeModel: Model<MagicCode>,
  ) {}

  async generateCode(email: string): Promise<string> {
    const code = randomBytes(3).toString('hex'); // 6-char hex code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    await this.magicCodeModel.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true },
    );
    return code;
  }

  async verifyCode(email: string, code: string): Promise<void> {
    const record = await this.magicCodeModel.findOne({ email, code });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired code');
    }
    // Invalidate code after use
    await this.magicCodeModel.deleteOne({ email, code });
  }
}

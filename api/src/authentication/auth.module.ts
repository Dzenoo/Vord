import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/models/user/user.module';
import { MailModule } from '@/common/modules/email/mail.module';

import { GoogleAuthService } from './services/google-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { MagicCodeService } from './services/magic-code.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';

import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h', algorithm: 'HS256' },
      }),
    }),
    PassportModule,
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleAuthService,
    GoogleStrategy,
    MagicCodeService,
    JwtStrategy,
    TokenService,
    CookieService,
  ],
  exports: [TokenService, CookieService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/models/user/user.module';
import { MagicCodeModule } from '@/models/magic-code/magic-code.module';
import { MailModule } from '@/common/modules/email/mail.module';

import { AuthController } from './controllers/auth.controller';

import { GoogleAuthService } from './services/google-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';

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
    MagicCodeModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleAuthService,
    GoogleStrategy,
    JwtStrategy,
    TokenService,
    CookieService,
  ],
  exports: [TokenService, CookieService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/user/user.module';
import { GoogleStrategy } from './authentication/strategies/google.strategy';
import { ServerModule } from './models/server/server.module';
import { MessageModule } from './models/message/message.module';
import { DmChannelModule } from './models/dm/dm-channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGODB_URI'),
          dbName: configService.get<string>('MONGODB_NAME'),
        };
      },
    }),
    AuthModule,
    UserModule,
    ServerModule,
    MessageModule,
    DmChannelModule,
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}

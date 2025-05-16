import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DmChannel, DmChannelSchema } from './schema/dm-channel.schema';
import { DmChannelController } from './dm-channel.controller';
import { DmChannelService } from './dm-channel.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DmChannel.name,
        schema: DmChannelSchema,
      },
    ]),
  ],
  controllers: [DmChannelController],
  exports: [DmChannelService],
  providers: [DmChannelService],
})
export class DmChannelModule {}

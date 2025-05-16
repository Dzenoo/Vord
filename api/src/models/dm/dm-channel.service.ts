import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DmChannel } from './schema/dm-channel.schema';

@Injectable()
export class DmChannelService {
  constructor(
    @InjectModel(DmChannel.name) private readonly serverModel: Model<DmChannel>,
  ) {}
}

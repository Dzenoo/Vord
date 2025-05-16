import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Server } from './schema/server.schema';
import { Channel } from './schema/channel.schema';
import { Category } from './schema/category.schema';
import { Role } from './schema/role.schema';

@Injectable()
export class ServerService {
  constructor(
    @InjectModel(Server.name) private readonly serverModel: Model<Server>,
    @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}
}

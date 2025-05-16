import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Server, ServerSchema } from './schema/server.schema';
import { Channel, ChannelSchema } from './schema/channel.schema';
import { Category, CategorySchema } from './schema/category.schema';
import { Role, RoleSchema } from './schema/role.schema';

import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [ServerController],
  exports: [ServerService],
  providers: [ServerService],
})
export class ServerModule {}

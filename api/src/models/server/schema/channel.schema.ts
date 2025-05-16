import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { TypeOfChannel } from '@/types';
import { Server } from './server.schema';
import { Category } from './category.schema';
import { User } from '@/models/user/schema/user.schema';

@Schema({ timestamps: true })
export class Channel {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 55,
    match: nameRegex,
  })
  name: string;

  @Prop({
    type: String,
    enum: TypeOfChannel,
    default: 'text',
  })
  type: TypeOfChannel;

  @Prop({
    type: Types.ObjectId,
    ref: 'Server',
    required: true,
  })
  serverId: Server & Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  categoryId?: Category & Types.ObjectId;

  // Voice channel specific properties
  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 99,
  })
  userLimit?: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  connectedUsers?: User[] & Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isPrivate?: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  allowedUsers?: User[] & Types.ObjectId[];
}

export type ChannelDocument = HydratedDocument<Channel>;
export const ChannelSchema = SchemaFactory.createForClass(Channel);

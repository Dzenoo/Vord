import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { TypeOfChannel } from '@/types';

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
  serverId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  categoryId?: Types.ObjectId;
}

export type ChannelDocument = HydratedDocument<Channel>;
export const ChannelSchema = SchemaFactory.createForClass(Channel);

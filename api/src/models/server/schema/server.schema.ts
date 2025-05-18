import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { getRandomColor } from '@/common/utils';

@Schema({
  timestamps: true,
})
export class Server {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 5,
    maxlength: 55,
    match: nameRegex,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  icon: string;

  @Prop({
    type: String,
    default: getRandomColor(),
  })
  banner?: string;

  @Prop({
    type: String,
    default: '',
  })
  description?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'ServerMember',
    default: [],
  })
  members: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Channel',
    default: [],
  })
  channels: Types.ObjectId[];
}

export type ServerDocument = HydratedDocument<Server>;
export const ServerSchema = SchemaFactory.createForClass(Server);

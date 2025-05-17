import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { getRandomColor } from '@/common/utils';
import { DmChannel } from '@/models/dm/schema/dm-channel.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15,
    trim: true,
    unique: true,
    match: nameRegex,
    index: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 155,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    default: '',
  })
  avatarUrl?: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    default: '',
  })
  displayName?: string;

  @Prop({
    type: String,
    trim: true,
    default: '',
  })
  aboutMe?: string;

  @Prop({
    type: String,
    default: getRandomColor(),
  })
  bannerColor?: string;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        type: {
          type: String,
          enum: ['incoming', 'outgoing'],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  })
  friendRequests: {
    user: Types.ObjectId;
    type: 'incoming' | 'outgoing';
    createdAt?: Date;
  }[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  friends: User[] & Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'DmChannel',
    default: [],
  })
  directMessages: DmChannel[] & Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isGoogleAccount?: boolean;

  @Prop()
  refreshToken?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

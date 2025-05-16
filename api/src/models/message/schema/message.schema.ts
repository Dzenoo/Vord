import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MessageContextType, TypeOfAttachment } from '@/types';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  content: string;

  @Prop({ type: Types.ObjectId, required: true })
  contextId: Types.ObjectId;

  @Prop({ type: String, enum: MessageContextType, required: true })
  contextType: MessageContextType;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  replyTo?: Types.ObjectId;

  @Prop({
    type: [
      {
        emoji: String,
        users: [{ type: Types.ObjectId, ref: 'User' }],
      },
    ],
    default: [],
  })
  reactions?: {
    emoji: string;
    users: Types.ObjectId[];
  };

  @Prop({
    type: [
      {
        name: String,
        url: String,
        type: { type: String, enum: TypeOfAttachment },
      },
    ],
    default: [],
  })
  attachments?: {
    name: string;
    url: string;
    type: string;
  };
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

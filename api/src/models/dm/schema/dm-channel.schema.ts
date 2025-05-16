import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class DmChannel {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
    validate: {
      validator: function (participants: Types.ObjectId[]) {
        return participants.length === 2;
      },
      message: 'DM channel must have exactly 2 participants',
    },
  })
  participants: Types.ObjectId[];

  @Prop({ type: String, default: null })
  name?: string;

  @Prop({ type: String, default: null })
  icon?: string;
}

export type DmChannelDocument = HydratedDocument<DmChannel>;
export const DmChannelSchema = SchemaFactory.createForClass(DmChannel);

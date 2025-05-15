import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MagicCode {
  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  })
  email: string;

  @Prop({ required: true, minlength: 6, maxlength: 6 })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type MagicCodeDocument = HydratedDocument<MagicCode>;
export const MagicCodeSchema = SchemaFactory.createForClass(MagicCode);

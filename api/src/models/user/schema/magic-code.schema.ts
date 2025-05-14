import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MagicCode {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type MagicCodeDocument = MagicCode & Document;
export const MagicCodeSchema = SchemaFactory.createForClass(MagicCode);

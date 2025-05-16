import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { Server } from './server.schema';

@Schema({ timestamps: true })
export class Category {
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
    type: Types.ObjectId,
    ref: 'Server',
    required: true,
  })
  serverId: Server & Types.ObjectId;

  @Prop({ default: 0 })
  position: number;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);

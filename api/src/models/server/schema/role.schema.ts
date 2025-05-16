import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { nameRegex } from '@/common/constants';
import { getRandomColor } from '@/common/utils';

@Schema({
  timestamps: true,
})
export class Role {
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
    default: getRandomColor(),
  })
  color?: string;

  @Prop({
    type: Map,
    of: Boolean,
    default: {},
  })
  permissions: Record<string, boolean>;
}

export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);

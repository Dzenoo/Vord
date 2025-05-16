import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ServerMember {
  @Prop({
    type: String,
    minlength: 5,
    maxlength: 15,
    trim: true,
  })
  displayName?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Server',
  })
  server: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Role' }],
    required: true,
  })
  roles: Types.ObjectId[];
}

export type ServerMemberDocument = HydratedDocument<ServerMember>;
export const ServerMemberSchema = SchemaFactory.createForClass(ServerMember);

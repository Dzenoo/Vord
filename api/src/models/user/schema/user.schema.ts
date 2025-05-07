import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    trim: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isGoogleAccount?: boolean;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

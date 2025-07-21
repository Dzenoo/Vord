import mongoose, { Schema } from "mongoose";

export interface MessageTypes extends Document {
  from: typeof mongoose.Types.ObjectId;
  content: string;
}

const MessageSchema = new Schema<MessageTypes>(
  {
    from: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message ||
  mongoose.model<MessageTypes>("Message", MessageSchema);

export default Message;

import { DirectMessageType } from "@/types/users";
import mongoose, { Schema } from "mongoose";

interface RoleType {
  name: "Admin" | "Moderator" | "Member";
  members: mongoose.Types.ObjectId[];
}

export interface ChannelType {
  _id: string;
  name: string;
  type: "text" | "voice";
  messages: DirectMessageType[];
}

export interface ServerTypes extends Document {
  name: string;
  image: string;
  creatorId: mongoose.Types.ObjectId;
  roles: RoleType[];
  categories: {
    _id: string;
    name: string;
    channels: ChannelType[];
  }[];
  members: mongoose.Types.ObjectId[];
}

const ServerSchema: Schema = new Schema<ServerTypes>(
  {
    name: { type: String, required: [true, "Name is not valid"] },
    image: {
      type: String,
      required: [true, "Image is not valid"],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is not valid"],
    },
    roles: [
      {
        name: {
          type: String,
          enum: ["Admin", "Moderator", "Member"],
          required: true,
        },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    categories: [
      {
        name: { type: String, required: true },
        channels: [
          {
            name: { type: String },
            type: { type: String, enum: ["text", "voice"], required: true },
            messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
          },
        ],
      },
    ],
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Server =
  mongoose.models.Server || mongoose.model<ServerTypes>("Server", ServerSchema);

export default Server;

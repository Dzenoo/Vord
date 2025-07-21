import { UserTypes } from "./users";

export interface ServerChannel {
  _id: string;
  name: string;
  type: "text" | "voice";
  messages: MessageItem[];
}

export interface ServersCategory {
  channels: ServerChannel[];
  _id: string;
  name: string;
}

export interface ServerItem {
  _id: string | number | any;
  name: string;
  image: string;
  creatorId: string;
  roles: {
    name: "Admin" | "Moderator" | "Member";
    members: string[];
  }[];
  categories: ServersCategory[];
  members: UserTypes[];
}

export interface MessageItem {
  _id: string;
  from: UserTypes;
  content: string;
  createdAt: string;
}

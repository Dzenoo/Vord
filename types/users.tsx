import { MessageItem, ServerItem } from "./servers";

export interface UserTypes {
  _id: string | number | any;
  username: string;
  name: string;
  image: string;
  email?: string;
  password?: string;
  directMessages: DirectMessageType[];
  notifications: {
    _id: string;
    message: string;
    date: string;
  }[];
  friends: FriendsItem[];
  servers?: ServerItem[];
  roles?: {
    name: "Admin" | "Moderator" | "Member";
    members: string[];
  }[];
  createdAt: string;
}

export interface DirectMessageType {
  userId: {
    _id: string;
    username: string;
    image: string;
  };
  messages: MessageItem[];
}

export interface FriendsItem {
  _id: string | number | any;
  username: string;
  image: string;
  friends?: UserTypes[];
}

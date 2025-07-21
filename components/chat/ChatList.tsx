import React from "react";
import ChatItem from "./ChatItem";
import { MessageItem } from "@/types/servers";

interface ChatListProps {
  messages: MessageItem[];
  friendId?: string;
  channelId?: string;
  serverId?: string;
  isAdmin?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  messages,
  friendId,
  serverId,
  channelId,
  isAdmin,
}) => {
  const filteredMessages: { [key: string]: MessageItem[] } = {};
  messages?.forEach((message: MessageItem) => {
    const dateKey = new Date(message.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!filteredMessages[dateKey]) {
      filteredMessages[dateKey] = [];
    }
    filteredMessages[dateKey].push(message);
  });

  return (
    <div className="py-8">
      {Object.keys(filteredMessages).length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-300">No messages yet</p>
        </div>
      )}
      {Object.keys(filteredMessages).map((dateKey: string) => (
        <div key={dateKey} className="my-4">
          <p className="text-white font-bold text-xs text-center mb-2">
            {dateKey}
          </p>
          {filteredMessages[dateKey].map(
            (message: MessageItem, ind: number) => (
              <ChatItem
                key={ind}
                userId={message?.from?._id}
                userImage={message.from?.image}
                username={message.from?.username}
                messageId={message._id}
                content={message.content}
                date={message.createdAt}
                friendId={friendId}
                serverId={serverId}
                channelId={channelId}
                isAdmin={isAdmin!}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;

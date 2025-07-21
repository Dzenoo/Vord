import ChatList from "@/components/chat/ChatList";
import { MessageItem } from "@/types/servers";

interface ServersDetailsChatTypes {
  messages: MessageItem[];
  channelId?: string;
  serverId?: string;
  isAdmin: boolean;
}

const ServersDetailsChat: React.FC<ServersDetailsChatTypes> = ({
  messages,
  channelId,
  serverId,
  isAdmin,
}) => {
  return (
    <div className="p-3 h-[80vh] overflow-y-scroll">
      <div className="pb-3 border-b border-gray-700">
        <p className="text-gray-300">This is the beggining of the channel</p>
      </div>
      <ChatList
        messages={messages}
        serverId={serverId}
        channelId={channelId}
        friendId={undefined}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default ServersDetailsChat;

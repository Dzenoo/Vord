import ChatList from "@/components/chat/ChatList";
import { MessageItem } from "@/types/servers";
import Image from "next/image";

interface ConversationChatProps {
  username: string;
  image: string;
  name: string;
  messages?: MessageItem[];
  friendId?: string;
}

const ConversationChat: React.FC<ConversationChatProps> = ({
  username,
  image,
  name,
  messages,
  friendId,
}) => {
  return (
    <div className="p-3 py-6 h-[80vh] overflow-y-scroll">
      <div>
        <div>
          <Image
            src={image}
            alt={`user_${username}`}
            className="rounded-full w-24 h-24"
            width={100}
            height={100}
          />
        </div>
        <div className="py-3 flex items-center gap-8">
          <div>
            <h2 className="text-white text-xl font-bold">{name}</h2>
            <p className="text-lg text-gray-300">{username}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-400">
            This is your chat and conversation with {username}.
          </p>
        </div>
      </div>
      <ChatList messages={messages!} friendId={friendId} />
    </div>
  );
};

export default ConversationChat;

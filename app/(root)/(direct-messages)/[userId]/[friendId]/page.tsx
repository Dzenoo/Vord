import { ServerItem } from "@/types/servers";
import { DirectMessageType, FriendsItem, UserTypes } from "@/types/users";
import { getServerSession } from "next-auth";
import { fetchUser } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/session";
import { notFound } from "next/navigation";
import ConversationChat from "@/components/direct-messages/conversation/ConversationChat";
import ConversationInformation from "@/components/direct-messages/conversation/ConversationInformation";
import ConversationTopBar from "@/components/direct-messages/conversation/ConversationTopBar";
import ConversationChatForm from "@/components/direct-messages/conversation/ConversationChatForm";
import MediaRoom from "@/components/servers/details/mediachat/MediaRoom";

const Conversation = async ({
  params,
  searchParams,
}: {
  params: { friendId: string };
  searchParams: { type: string };
}) => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userIdAuth: string = session?.user?.id;
  const user: UserTypes = await fetchUser(userIdAuth);
  const friend: UserTypes = await fetchUser(params.friendId);

  if (!user || !friend || !session || !params.friendId) {
    notFound();
  }

  const mutualServers: ServerItem[] | undefined = user?.servers?.filter(
    (server: ServerItem) => server.members.includes(friend._id.toString())
  );

  const mutualFriends: FriendsItem[] = user?.friends?.filter(
    (friend: FriendsItem) => friend?.friends?.includes(friend?._id)
  );

  const directMessages: DirectMessageType | undefined =
    user?.directMessages?.find(
      (directMessage: DirectMessageType) =>
        directMessage.userId._id.toString() === friend?._id.toString()
    );

  return (
    <div className="flex h-screen">
      <div className="basis-full grow flex flex-col justify-between">
        <div>
          <ConversationTopBar username={friend?.username} image={user?.image} />
        </div>
        {searchParams.type === "chat" && (
          <>
            <div>
              <ConversationChat
                username={friend?.username}
                image={friend?.image}
                name={friend?.name}
                messages={directMessages?.messages}
                friendId={params?.friendId}
              />
            </div>
            <div className="p-3 sticky bottom-0 right-0">
              <ConversationChatForm
                friendId={friend?._id}
                friendUsername={friend?.username}
                userId={userIdAuth}
              />
            </div>
          </>
        )}
        {searchParams.type === "voice" && (
          <>
            <MediaRoom
              chatId={"chatId"}
              video={false}
              audio={true}
              user={JSON.parse(JSON.stringify(user))}
            />
          </>
        )}
      </div>
      <div className="basis-96 min-h-[90vh]">
        <ConversationInformation
          userId={userIdAuth}
          username={friend?.username}
          image={friend?.image}
          name={friend?.name}
          createdAt={friend?.createdAt}
          mutualServers={mutualServers}
          mutualFriends={mutualFriends}
        />
      </div>
    </div>
  );
};

export default Conversation;

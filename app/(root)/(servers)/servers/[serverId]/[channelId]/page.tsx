import { notFound } from "next/navigation";
import {
  ServerChannel as ServerChannelPropsTypes,
  ServerItem,
} from "@/types/servers";
import { getServerSession } from "next-auth";
import { UserTypes } from "@/types/users";
import { getChannel, isUserAdminForServer } from "@/lib/functions";
import { fetchServerById } from "@/lib/actions/servers.actions";
import { authOptions } from "@/lib/session";
import { fetchUser } from "@/lib/actions/user.actions";
import ChatForm from "@/components/servers/channels/ChatForm";
import ServersDetailsChat from "@/components/servers/details/navigation/ServersDetailsChat";
import ServersDetailsTopBar from "@/components/servers/details/navigation/ServersDetailsTopBar";
import ServersDetailsSidebar from "@/components/servers/details/navigation/ServersDetailsSidebar";
import ServersDetailsInformations from "@/components/servers/details/navigation/ServersDetailsInformations";
import MediaRoom from "@/components/servers/details/mediachat/MediaRoom";

const ServerChannel = async ({
  params: { serverId, channelId },
}: {
  params: {
    serverId: string;
    channelId: string;
  };
}) => {
  const session = await getServerSession(authOptions);
  const fetchedServer: ServerItem = await fetchServerById(serverId);
  // @ts-ignore
  const fetchedUser: UserTypes = await fetchUser(session?.user?.id);

  if (!fetchedServer || !fetchedUser || !session) {
    notFound();
  }

  const server: ServerItem = JSON.parse(JSON.stringify(fetchedServer));
  const channel: ServerChannelPropsTypes = getChannel(
    server?.categories,
    channelId
  );
  const isUserAdmin = isUserAdminForServer(server, fetchedUser);

  return (
    <div className="flex">
      <div className="basis-[30em] max-w-[240px] w-full">
        <ServersDetailsSidebar
          serverName={server?.name}
          serverId={serverId}
          channelId={channelId}
          isAdmin={isUserAdmin}
          categories={server?.categories}
          user={{
            _id: fetchedUser?._id,
            username: fetchedUser?.username,
            name: fetchedUser?.name,
            image: fetchedUser?.image,
            createdAt: fetchedUser?.createdAt,
          }}
        />
      </div>
      {channel.type === "text" && (
        <div className="basis-full grow flex flex-col justify-between">
          <div>
            <ServersDetailsTopBar name={channel?.name} />
          </div>
          <div>
            <ServersDetailsChat
              messages={channel?.messages}
              serverId={serverId}
              channelId={channelId}
              isAdmin={isUserAdmin}
            />
          </div>
          <div className="p-3 sticky bottom-0 right-0">
            <ChatForm serverId={serverId} channelId={channelId} />
          </div>
        </div>
      )}
      {channel.type === "voice" && (
        <div className="basis-full grow flex flex-col justify-between">
          <MediaRoom
            chatId={channelId}
            video={true}
            audio={true}
            user={JSON.parse(JSON.stringify(fetchedUser))}
          />
        </div>
      )}
      <div className="basis-[30em] max-w-[240px] w-full">
        <ServersDetailsInformations server={server} />
      </div>
    </div>
  );
};

export default ServerChannel;

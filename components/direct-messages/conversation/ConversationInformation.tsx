import Image from "next/image";
import Toggle from "@/components/shared/elements/Toggle";
import LinkHref from "@/components/shared/elements/Link";
import { ServerItem } from "@/types/servers";
import { FriendsItem } from "@/types/users";
import { formatCreatedDate } from "@/lib/functions";

interface ConversationInformationProps {
  userId: string;
  username: string;
  image: string;
  name: string;
  createdAt: string;
  mutualServers?: ServerItem[];
  mutualFriends?: FriendsItem[];
}

const ConversationInformation: React.FC<ConversationInformationProps> = ({
  userId,
  username,
  image,
  name,
  createdAt,
  mutualServers,
  mutualFriends,
}) => {
  const formatedDate = formatCreatedDate(createdAt);

  return (
    <div className="shadow-md h-full flex flex-col gap-3">
      <div className={`h-28 bg-blue-600`}>
        <Image
          src={image}
          alt={`user_${username}`}
          className="rounded-full w-24 h-24 border-4 border-gray-800 relative left-3 top-16"
          width={100}
          height={100}
        />
      </div>
      <div className="bg-[#191919] rounded-md mt-16 mx-3 p-3">
        <div className="pb-3 border-b border-gray-600">
          <h2 className="text-white">{name}</h2>
          <p className="text-xs text-gray-300">{username}</p>
        </div>
        <div className="py-3 border-b border-gray-600">
          <h2 className="text-gray-300 section_subtitle">
            Chatcord member since
          </h2>
          <p className="mt-3 text-xs text-gray-300">{formatedDate}</p>
        </div>
      </div>
      <div>
        <div className="bg-[#191919] rounded-t mx-3 p-3 hover:bg-[#212121]">
          <Toggle
            title={`${mutualServers?.length} Mutual Servers`}
            content={
              mutualServers?.length === 0 ? (
                <p className="text-white text-center">
                  No mutual servers found
                </p>
              ) : (
                mutualServers?.map((server: ServerItem) => (
                  <LinkHref
                    key={server._id}
                    image={server.image}
                    title={server.name}
                    href={`/servers/${server._id}/${server.categories[0].channels[0]._id}`}
                  />
                ))
              )
            }
          />
        </div>
        <div className="bg-[#191919] rounded-b mx-3 p-3 hover:bg-[#212121]">
          <Toggle
            title={`${mutualFriends?.length} Mutual Friends`}
            content={
              mutualFriends?.length === 0 ? (
                <p className="text-white text-center">
                  No mutual friends found
                </p>
              ) : (
                mutualFriends?.map((friends: FriendsItem) => (
                  <LinkHref
                    key={friends._id}
                    image={friends.image}
                    title={friends.username}
                    href={`/${userId}/${friends._id}`}
                  />
                ))
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationInformation;

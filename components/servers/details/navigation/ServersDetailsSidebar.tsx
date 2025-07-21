import ManageProfileBar from "@/components/profile-management/ManageProfileBar";
import Category from "../../channels/Category";
import ManageServerBar from "../../server-management/ManageServerBar";
import { ServersCategory } from "@/types/servers";

interface ServersDetailSidebarTypes {
  serverName: string;
  serverId: string;
  channelId: string;
  categories: ServersCategory[];
  isAdmin: boolean;
  user: {
    _id: string;
    username: string;
    name: string;
    image: string;
    createdAt: string;
  };
}

const ServersDetailsSidebar: React.FC<ServersDetailSidebarTypes> = ({
  serverName,
  serverId,
  channelId,
  isAdmin,
  categories,
  user: userData,
}) => {
  const user = JSON.parse(JSON.stringify(userData));

  return (
    <div className="min-h-screen bg-[#222222] overflow-hidden flex flex-col justify-between">
      <div>
        <ManageServerBar
          serverName={serverName}
          serverId={serverId}
          channelId={channelId}
          isAdmin={isAdmin}
        />
        <div className="p-3 flex flex-col gap-6 overflow-y-scroll h-[34em]">
          {categories?.map((category: ServersCategory) => (
            <Category
              categoryId={category._id}
              key={`category_${category._id}`}
              category={category}
              serverId={serverId}
              channelId={channelId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
      <div className="p-3">
        <ManageProfileBar
          username={user?.username}
          name={user?.name}
          userId={user?._id}
          image={user?.image}
          createdDate={user?.createdAt}
        />
      </div>
    </div>
  );
};

export default ServersDetailsSidebar;

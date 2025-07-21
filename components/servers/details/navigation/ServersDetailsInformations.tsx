import { UserTypes } from "@/types/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/session";
import { isUserAdminForServer } from "@/lib/functions";
import { ServerItem } from "@/types/servers";
import LinkHref from "@/components/shared/elements/Link";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServersDetailsInformationsTypes {
  server: ServerItem;
}

const ServersDetailsInformations: React.FC<
  ServersDetailsInformationsTypes
> = async ({ server }) => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  function renderAdminJsx() {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AdminPanelSettingsIcon style={{ color: "lightblue" }} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Admin</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="p-3 min-h-screen bg-[#222222] overflow-hidden">
      <div>
        <div>
          <h2 className="text-xs uppercase text-gray-400 font-bold truncate">
            Online
          </h2>
        </div>
        <div className="py-3 w-full">
          {server?.members?.map((member: UserTypes) => {
            const isMemberAdmin = isUserAdminForServer(server, member);

            return (
              <div className="flex items-center gap-3 w-full" key={member._id}>
                <LinkHref
                  key={`member_${member?._id}`}
                  href={`${
                    member._id === userId
                      ? server?.categories[0].channels[0]._id
                      : `/${userId}/${member?._id}?type=chat`
                  }`}
                  image={member?.image}
                  title={member?.name}
                />
                {isMemberAdmin && renderAdminJsx()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServersDetailsInformations;

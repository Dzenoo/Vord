import { addToServer } from "@/lib/actions/servers.actions";
import { authOptions } from "@/lib/session";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { FadeLoader } from "react-spinners";

const ServerInvitePage = async ({
  params: { serverId },
}: {
  params: { serverId: string };
}) => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userIdAuth = session?.user.id;
  if (!session || !serverId) {
    notFound();
  }
  const response = await addToServer(serverId, userIdAuth);
  const responseMessage = "Added to server successfully.";

  if (response?.message === responseMessage) {
    redirect(
      `/servers/${response.server._id}/${response.server.categories[0].channels[0]._id}`
    );
  } else {
    redirect(`/${userIdAuth}`);
  }

  return <>{response?.message !== responseMessage ? <FadeLoader /> : null}</>;
};

export default ServerInvitePage;

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/session";

const NotFoundPage = async () => {
  const session: any = await getServerSession(authOptions);

  if (session) {
    redirect(`/${session.user.id}`);
  } else {
    redirect("/login");
  }
};

export default NotFoundPage;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginCard from "@/components/auth/login/LoginCard";
import { authOptions } from "@/lib/session";

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <section className="flex justify-center items-center h-screen overflow-x-hidden">
      <LoginCard />
    </section>
  );
};

export default LoginPage;

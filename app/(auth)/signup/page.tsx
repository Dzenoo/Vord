import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignupCard from "@/components/auth/signup/SignupCard";
import { authOptions } from "@/lib/session";

const SignupPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <section className="flex justify-center items-center h-screen overflow-x-hidden">
      <SignupCard />
    </section>
  );
};

export default SignupPage;

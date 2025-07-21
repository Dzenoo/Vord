import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ServerItem } from "@/types/servers";
import SidebarServers from "@/components/shared/navigation/SidebarServers";
import AuthProvider from "@/context/AuthProvider";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { fetchUser } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatcord",
  description:
    "This is a Discord Clone Application built with Next.js, Typesscript and Tailwind CSS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId: string = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await fetchUser(userId);
  const servers: ServerItem[] = JSON.parse(JSON.stringify(user?.servers));

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} flex`}>
          <div className="fixed bottom-0 top-0 right-0 left-0 w-full h-full min-h-screen bg-gray-700 z-40 flex justify-center items-center text-white lg:hidden">
            <h2>Application is not responsive</h2>
          </div>
          <SidebarServers servers={servers} userId={userId} />
          <main className="w-full">{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
}

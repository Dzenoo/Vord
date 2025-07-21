import { ServersCategory, ServerChannel, ServerItem } from "@/types/servers";
import { UserTypes } from "@/types/users";
import { useSession } from "next-auth/react";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function uploadImage(imagePath: string): Promise<any> {
  try {
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });

    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export function getChannel(
  categories: ServersCategory[],
  channelId: string
): ServerChannel {
  let channel = {} as ServerChannel;
  for (const category of categories) {
    const categoryChannel = category.channels.find(
      (channel: ServerChannel) => channel._id === channelId
    );
    if (categoryChannel) {
      channel = categoryChannel;
    }
  }

  return channel;
}

export function formatCreatedDate(date: string) {
  const createdDate = new Date(date).toLocaleDateString("en-US");

  return createdDate;
}

export function updateSearchParams<T extends string>(
  type: T,
  value: T
): string {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
}

export function deleteSearchParams<T extends string>(type: T): string {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(type);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
}

export function generateServerInviteLink(serverId: string) {
  const link = `${process.env.NEXT_PUBLIC_URL}/servers/invite/${serverId}`;
  return link;
}

export function isUserAdminForServer(
  server: ServerItem,
  user: UserTypes
): boolean {
  const adminRole = server.roles.find((role) => role.name === "Admin");
  const isAdmin = adminRole?.members.includes(user._id.toString()) || false;
  return isAdmin;
}

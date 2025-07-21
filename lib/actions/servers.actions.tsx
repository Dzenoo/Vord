"use server";

import Server from "../models/server";
import User from "../models/user";
import Message from "../models/message";
import { uploadImage } from "../functions";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";
import {
  createCategories,
  createRoles,
  findCategoryById,
  findChannelById,
  findServerById,
  updateUser,
  validateServerInputs,
} from "./functions/functions.actions";

export async function createServer(
  serverName: string,
  serverImage: string,
  userId: string,
  path: string
): Promise<any> {
  try {
    await connectToDb();

    const { isValid, errorMessage } = await validateServerInputs(
      serverName,
      serverImage,
      userId
    );

    if (!isValid) {
      return { message: errorMessage };
    }

    const uploadedImage = await uploadImage(serverImage);

    const roles = await createRoles(userId);
    const categories = await createCategories();
    const members = [userId];

    const createdServer = await Server.create({
      name: serverName,
      image: uploadedImage.url,
      creatorId: userId,
      roles: [roles],
      categories: [categories],
      members,
    });

    await updateUser(userId, createdServer);

    const serverId = createdServer._id;
    const channelId = createdServer.categories[0].channels[0]._id;

    revalidatePath(path);

    return {
      message: "Server created successfully.",
      serverId,
      channelId,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchServerById(serverId: string): Promise<any> {
  try {
    await connectToDb();

    const server = await Server.findById(serverId)
      .populate({
        path: "members",
        model: User,
        select: "name _id username image",
      })
      .populate({
        path: "categories.channels.messages",
        model: Message,
        populate: {
          path: "from",
          model: User,
          select: "name _id username image",
        },
      });

    if (!server) {
      return { message: "Server not found." };
    }

    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function createMessageServer(
  serverId: string,
  channelId: string,
  message: string,
  userId: string,
  path: string
): Promise<any> {
  try {
    await connectToDb();

    const server = await findServerById(serverId);
    const channelInfo = await findChannelById(serverId, channelId);

    if (!channelInfo || !server) {
      return { message: "Server or channel is not found." };
    }

    const newMessage = await Message.create({
      from: userId,
      content: message,
    });

    const { categoryIndex, channelIndex } = channelInfo;

    server.categories[categoryIndex].channels[channelIndex].messages.push(
      newMessage._id
    );

    revalidatePath(path);
    await server.save();

    return { message: "Message sent successfully." };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteMessageServer(
  serverId: string,
  channelId: string,
  messageId: string,
  path: string
) {
  try {
    await connectToDb();

    await Message.findByIdAndDelete(messageId);

    const server = await findServerById(serverId);
    const channelInfo = await findChannelById(serverId, channelId);

    if (!channelInfo || !server) {
      return { message: "Server or channel is not found." };
    }

    const { categoryIndex, channelIndex } = channelInfo;

    server.categories[categoryIndex].channels[channelIndex].messages.pull(
      messageId
    );
    await server.save();

    revalidatePath(path);
    return { message: "Message deleted." };
  } catch (error) {
    console.log(error);
  }
}

export async function createCategory(
  serverId: string,
  categoryName: string,
  path: string
): Promise<any> {
  try {
    await connectToDb();

    if (!categoryName) return { message: "Category name is required." };

    const server = await Server.findByIdAndUpdate(serverId, {
      $push: {
        categories: {
          name: categoryName,
          channels: [],
        },
      },
    });

    if (!server || !serverId || !categoryName) {
      return { message: "Server not found." };
    }

    revalidatePath(path);

    return { message: "Category created successfully." };
  } catch (error) {
    console.log(error);
  }
}

export async function createChannel(
  serverId: string,
  categoryId: string,
  channelName: string,
  channelType: string,
  path: string
): Promise<any> {
  try {
    await connectToDb();

    const server = await findServerById(serverId);

    if (!server) {
      return { message: "Server not found." };
    }

    const category = await findCategoryById(serverId, categoryId);

    if (!category) {
      return { message: "Category not found." };
    }

    const { categoryIndex, categoryObject } = category;

    server.categories[categoryIndex].channels.push({
      name: channelName,
      type: channelType,
      messages: [],
    });

    revalidatePath(path);
    await server.save();

    return { message: "Channel created successfully." };
  } catch (error) {
    console.log(error);
  }
}

export async function addToServer(
  serverId: string,
  userId: string,
  path?: string
) {
  try {
    await connectToDb();

    if (!serverId || !userId) {
      return { message: "Server or User not found." };
    }

    const server = await Server.findById(serverId);

    if (!server || server.members.includes(userId)) {
      return { message: "User is already a member of the server." };
    }

    const updatedServer = await Server.findByIdAndUpdate(serverId, {
      $push: {
        members: userId,
      },
    });

    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        servers: serverId,
      },
    });

    if (!updatedServer || !user) {
      return { message: "Server or User not found." };
    }

    path && revalidatePath(path);

    return { message: "Added to server successfully.", server: updatedServer };
  } catch (error) {
    console.error(error);
  }
}

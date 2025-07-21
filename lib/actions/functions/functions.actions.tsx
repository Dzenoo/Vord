"use server";

import Server, { ChannelType, ServerTypes } from "@/lib/models/server";
import User, { UserTypes } from "@/lib/models/user";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  validate,
} from "@/lib/validators/Validators";

export async function findServerById(serverId: string) {
  const server = await Server.findById(serverId);

  if (!server) {
    return null;
  }

  return server;
}

export async function findChannelById(
  serverId: string,
  channelId: string
): Promise<{
  categoryIndex: number;
  channelIndex: number;
  channel: ChannelType;
} | null> {
  let result = null;
  const server: ServerTypes | null = await Server.findById(serverId).exec();

  if (!server) {
    return null;
  }

  for (let i = 0; i < server.categories.length; i++) {
    const category = server.categories[i];
    for (let j = 0; j < category.channels.length; j++) {
      const channelFind = category.channels[j];
      if (channelFind._id.toString() === channelId) {
        result = {
          categoryIndex: i,
          channelIndex: j,
          channel: channelFind,
        };
        break;
      }
    }
    if (result) {
      break;
    }
  }

  return result;
}

export async function findUserById(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  return user as UserTypes;
}

export async function findDirectMessages(userId: string, friendId: string) {
  const user = await findUserById(userId);

  if (!user) {
    return null;
  }

  const directMessages = user.directMessages.find(
    (directMessage: any) =>
      directMessage.userId.toString() === friendId.toString()
  );

  return directMessages;
}

export async function findCategoryById(
  serverId: string,
  categoryId: string
): Promise<
  | {
      categoryIndex: number;
      category: any;
    }
  | any
> {
  let result = null;
  const server: ServerTypes | null = await Server.findById(serverId).exec();

  if (!server) {
    return null;
  }

  for (let i = 0; i < server.categories.length; i++) {
    const category = server.categories[i];
    if (category._id.toString() === categoryId) {
      result = {
        categoryIndex: i,
        category,
      };
      break;
    }
  }

  return result;
}

export async function updateUser(userId: string, createdServer: any) {
  await User.findByIdAndUpdate(userId, {
    $push: {
      servers: createdServer._id,
      roles: {
        serverId: createdServer._id,
        roleId: createdServer.roles[0]._id,
      },
    },
  });
}

export async function validateServerInputs(
  serverName: string,
  serverImage: string,
  userId: string
) {
  if (!serverImage || !serverName || !userId) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid server name, image, and userId",
    };
  }

  const isServerNameValid = validate(serverName, [
    VALIDATOR_REQUIRE(),
    VALIDATOR_MINLENGTH(3),
  ]);

  if (!isServerNameValid) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid server name.",
    };
  }

  return { isValid: true };
}

export async function createRoles(userId: string) {
  return {
    name: "Admin",
    members: [userId],
  };
}

export async function createCategories() {
  return {
    name: "Text Channels",
    channels: [
      {
        name: "general",
        type: "text",
        messages: [],
      },
    ],
  };
}

export async function findNotification(
  userId: string,
  friendId: string,
  friendUsername: string
) {
  let result = null;
  const currentUser = await findUserById(userId);

  if (!currentUser) return;

  for (let i = 0; i < currentUser.notifications.length; i++) {
    if (
      currentUser.notifications[i].message ===
      `${friendId} ${friendUsername} wants to be friends`
    ) {
      result = {
        notificationsIndex: i,
      };
    }
  }

  return result;
}

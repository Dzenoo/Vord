"use client";

import { Chat } from "@mui/icons-material";
import { Speed } from "@mui/icons-material";
import { Shop } from "@mui/icons-material";
import { DirectMessageType, UserTypes } from "@/types/users";
import { ChangeEvent } from "react";
import Tab from "@/components/shared/elements/Tab";
import ManageProfileBar from "@/components/profile-management/ManageProfileBar";
import LinkHref from "@/components/shared/elements/Link";
import useForm from "@/lib/hooks/useForm";

interface DirectMessagesSidebar {
  user: UserTypes;
}

const DirectMessagesSidebar: React.FC<DirectMessagesSidebar> = ({ user }) => {
  const { formState, inputChangeHandler } = useForm(
    {
      search_messages: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  return (
    <nav className="p-3 min-h-screen bg-[#222222] overflow-hidden flex flex-col justify-between">
      <div>
        <div className="border-b pb-4 border-gray-700">
          <input
            className="inputs"
            placeholder="Find a conversation"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler("search_messages", e.target.value, true)
            }
          />
        </div>
        <div>
          <div className="mt-3 flex flex-col gap-3">
            <LinkHref
              href={`/${user?._id}`}
              icon={<Chat style={{ color: "#fff" }} />}
              title="Friends"
            />
            <Tab icon={<Speed style={{ color: "#fff" }} />} title="Nitro" />
            <Tab icon={<Shop style={{ color: "#fff" }} />} title="Shop" />
          </div>
        </div>
        <div className="pt-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="section_subtitle text-gray-300">Direct Messages</h2>
          </div>
          <ul className="overflow-y-scroll h-[370px]">
            {user.directMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-gray-300 text-xs">No messages yet.</h2>
              </div>
            )}
            {user?.directMessages
              .filter((directMessages) =>
                directMessages.userId.username.includes(
                  formState.inputs.search_messages.value.toLowerCase()
                )
              )
              .map((directMessages: DirectMessageType) => (
                <LinkHref
                  key={`messages_${directMessages.userId.toString()}`}
                  href={`/${user?._id}/${directMessages?.userId._id}?type=chat`}
                  title={directMessages?.userId.username}
                  image={directMessages?.userId.image}
                />
              ))}
          </ul>
        </div>
      </div>
      <div>
        <ManageProfileBar
          username={user.username}
          name={user.name}
          userId={user._id.toString()}
          image={user.image}
          createdDate={user.createdAt}
        />
      </div>
    </nav>
  );
};

export default DirectMessagesSidebar;

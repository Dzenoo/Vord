"use client";
import Button from "@/components/shared/form/Button";
import Input, { InputElement } from "@/components/shared/form/Input";
import Tab from "@/components/shared/elements/Tab";
import {
  acceptFriendsDemand,
  exitFriendsDemand,
  sendFriendsDemand,
} from "@/lib/actions/user.actions";
import { formatCreatedDate } from "@/lib/functions";
import useForm from "@/lib/hooks/useForm";
import { Chat } from "@mui/icons-material";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface FriendsTopBarProps {
  notifications: {
    _id: string;
    message: string;
    date: string;
  }[];
}

type CurrentTopBar = "notifications" | "add-friend" | "";

export const FriendsTopBarData: {
  id: string;
  filter: CurrentTopBar;
  title: string;
}[] = [
  {
    id: "b0",
    title: "Notifications",
    filter: "notifications",
  },
  {
    id: "b3",
    title: "Add Friend",
    filter: "add-friend",
  },
];

const FriendsTopBar: React.FC<FriendsTopBarProps> = ({ notifications }) => {
  const { formState, inputChangeHandler, restartForm } = useForm(
    {
      add_friend: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [currentTab, setcurrentTab] = useState<CurrentTopBar>("notifications");
  const { data } = useSession();
  // @ts-ignore
  const userId: string = data?.user.id;

  function handleTabClick(title: CurrentTopBar) {
    setcurrentTab(title);
  }

  async function addFriendHandler(event: React.FormEvent) {
    event.preventDefault();

    if (formState.isValid === false) {
      toast.error("Please Enter Valid Name");
      return;
    }

    try {
      const response = await sendFriendsDemand(
        userId,
        formState.inputs.add_friend.value
      );

      if (response!.message === "Successfully added friend!") {
        toast.success(response!.message);
        restartForm(
          {
            add_friend: {
              value: "",
              isValid: false,
            },
          },
          false,
          "add-friend"
        );
      } else {
        toast.error(response!.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptDemand(notificationUserId: string): Promise<any> {
    const response = await acceptFriendsDemand(
      userId,
      notificationUserId,
      `/${userId}`
    );
    toast.info(response!.message);
  }

  async function denyDemand(notificationUserId: string): Promise<any> {
    const response = await exitFriendsDemand(
      userId,
      notificationUserId,
      `/${userId}`
    );
    toast.info(response!.message);
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6 items-center">
          <div className="flex gap-3 items-center border-r pr-3">
            <div>
              <Chat style={{ color: "#fff" }} />
            </div>
            <div>
              <h2 className="text-lg text-white">Friends</h2>
            </div>
          </div>
          <ul className="flex gap-3 items-center">
            {FriendsTopBarData.map(({ id, filter, title }) => {
              if (filter === "add-friend") {
                return (
                  <Button
                    key={id}
                    variant="primary"
                    type="button"
                    onClick={() => handleTabClick(filter)}
                  >
                    Add Friend
                  </Button>
                );
              } else {
                return (
                  <Tab
                    key={id}
                    title={title}
                    onClick={() => handleTabClick(filter)}
                  />
                );
              }
            })}
          </ul>
        </div>
        {currentTab === "add-friend" ? (
          <div className="pb-7 flex flex-col gap-3">
            <div>
              <h2 className="text-lg text-white">Add Friend</h2>
              <p className="text-xs text-gray-400">
                You can add friends with their Discord username
              </p>
            </div>
            <form
              className="flex items-center gap-3"
              onSubmit={addFriendHandler}
              id="add-friend"
            >
              <div className="basis-full">
                <Input
                  elementType={InputElement.INPUT}
                  id={"add_friend"}
                  type={"text"}
                  placeholder={"Enter username"}
                  validators={[]}
                  onInputChange={inputChangeHandler}
                  helperText="Please enter valid username"
                />
              </div>
              <div className="basis-40 mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Add Friend
                </Button>
              </div>
            </form>
          </div>
        ) : (
          currentTab === "notifications" && (
            <div>
              {notifications.length === 0 && (
                <p className="text-white">No notifications yet</p>
              )}
              {notifications.map(({ message, date, _id }) => {
                const notificationUserId = message.split(`"""`)[0];
                const notificationMessage = message.split(`"""`)[1];
                const formattedDate = formatCreatedDate(date);

                return (
                  <div
                    key={`notification_${_id}`}
                    className="p-3 flex justify-between items-center bg-[#2b2b2b] rounded-md shadow-md"
                  >
                    <div>
                      <div>
                        <h2 className="text-white font-bold">
                          {notificationMessage}
                        </h2>
                      </div>
                      <div>
                        <p className="text-white">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() =>
                          acceptDemand(notificationUserId.trim().toString())
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          denyDemand(notificationUserId.trim().toString())
                        }
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FriendsTopBar;

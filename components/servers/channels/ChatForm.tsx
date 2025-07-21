"use client";

import Input, { InputElement } from "../../shared/form/Input";

import { ToastContainer, toast } from "react-toastify";
import useForm from "@/lib/hooks/useForm";
import { createMessageServer } from "@/lib/actions/servers.actions";
import { VALIDATOR_REQUIRE } from "@/lib/validators/Validators";
import { useSession } from "next-auth/react";

interface ChatFormTypes {
  serverId: string;
  channelId: string;
}

const ChatForm: React.FC<ChatFormTypes> = ({ serverId, channelId }) => {
  const { data } = useSession();
  // @ts-ignore
  const userId: string = data?.user.id;
  const { formState, inputChangeHandler, restartForm } = useForm(
    {
      content: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  async function submitHandler(
    event: React.KeyboardEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (formState.isValid === false) {
      toast.error("Please enter a valid message");
      return;
    }

    createMessageServer(
      serverId,
      channelId,
      formState.inputs.content.value,
      userId,
      `/servers/${serverId}/${channelId}`
    ).then(() => {
      restartForm(
        {
          content: {
            value: "",
            isValid: false,
          },
        },
        false,
        "chat-servers"
      );
    });
  }

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={submitHandler}
        className="flex items-end gap-3"
        id="chat-servers"
      >
        <div className="basis-full">
          <Input
            elementType={InputElement.INPUT}
            id={"content"}
            type={"text"}
            placeholder={`Message`}
            validators={[VALIDATOR_REQUIRE()]}
            onInputChange={inputChangeHandler}
          />
        </div>
      </form>
    </>
  );
};

export default ChatForm;

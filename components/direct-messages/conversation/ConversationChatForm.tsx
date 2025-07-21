"use client";
import useForm from "@/lib/hooks/useForm";
import Input, { InputElement } from "../../shared/form/Input";
import { createMessagesForDirect } from "@/lib/actions/user.actions";
import { VALIDATOR_REQUIRE } from "@/lib/validators/Validators";

interface ConversationChatFormTypes {
  friendId: string;
  friendUsername: string;
  userId: string;
}

const ConversationChatForm: React.FC<ConversationChatFormTypes> = ({
  userId,
  friendId,
  friendUsername,
}) => {
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

    if (formState.isValid === false) return;

    const response = await createMessagesForDirect(
      userId,
      friendId,
      formState.inputs.content.value,
      `/${userId}/${friendId}`
    );

    if (response?.message === "Message sent.") {
      restartForm(
        {
          content: {
            value: "",
            isValid: false,
          },
        },
        false,
        "new-message"
      );
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-end gap-3"
      id="new-message"
    >
      <div className="basis-full">
        <Input
          elementType={InputElement.INPUT}
          id={"content"}
          type={"text"}
          placeholder={`Message ${friendUsername}`}
          validators={[VALIDATOR_REQUIRE()]}
          onInputChange={inputChangeHandler}
        />
      </div>
    </form>
  );
};

export default ConversationChatForm;

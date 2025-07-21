"use client";
import Button from "@/components/shared/form/Button";
import Input, { InputElement } from "@/components/shared/form/Input";
import Select from "@/components/shared/form/Select";
import { createChannel } from "@/lib/actions/servers.actions";
import useForm from "@/lib/hooks/useForm";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "@/lib/validators/Validators";

interface CreateChannelsFormTypes {
  categoryId: string;
  serverId: string;
  channelId: string;
  closeDialog: (dialogId: string) => void;
}

const CreateChannelsForm: React.FC<CreateChannelsFormTypes> = ({
  categoryId,
  serverId,
  channelId,
  closeDialog,
}) => {
  const { formState, inputChangeHandler, restartForm } = useForm(
    {
      channel_type: {
        value: "",
        isValid: false,
      },
      channel_name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  async function createChannelHandler(event: React.FormEvent) {
    event.preventDefault();

    if (!formState.isValid) return;

    try {
      const response = await createChannel(
        serverId,
        categoryId,
        formState.inputs.channel_name.value,
        formState.inputs.channel_type.value,
        `/servers/${serverId}/${channelId}`
      );

      if (response.message === "Channel created successfully.") {
        closeDialog("add_channels");
        restartForm(
          {
            channel_type: {
              value: "",
              isValid: false,
            },
            channel_name: {
              value: "",
              isValid: false,
            },
          },
          false,
          "create-channel"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="py-3 flex flex-col gap-6 w-96">
      <div>
        <h2 className="text-xl text-white font-bold">Create Channel</h2>
        <p className="text-xs text-gray-400">In Category Text Channels</p>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={createChannelHandler}
        id="create-channel"
      >
        <div>
          <Select
            id="channel_type"
            options={[
              { id: "", value: "", label: "Select Type" },
              { id: "text", value: "text", label: "Text Channel" },
              { id: "voice", value: "voice", label: "Voice Channel" },
            ]}
            onInputChange={inputChangeHandler}
            label="Channel Type"
          />
        </div>
        <div>
          <Input
            elementType={InputElement.INPUT}
            id={"channel_name"}
            type={"text"}
            placeholder={"Enter channel name"}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
            onInputChange={inputChangeHandler}
            label="Channel Name"
            helperText="Please enter a valid channel name."
          />
        </div>
        <div>
          <Button type="submit" disabled={!formState.isValid} variant="primary">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateChannelsForm;

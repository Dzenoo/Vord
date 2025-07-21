"use client";

import Button from "@/components/shared/form/Button";
import ImagesUpload from "@/components/shared/form/ImagesUpload";
import Input, { InputElement } from "@/components/shared/form/Input";
import { createServer } from "@/lib/actions/servers.actions";
import useForm from "@/lib/hooks/useForm";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "@/lib/validators/Validators";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface CreateServerFormTypes {
  dialogId: string;
  closeDialog: (dialogId: string) => void;
}

const CreateServerForm: React.FC<CreateServerFormTypes> = ({
  dialogId,
  closeDialog,
}) => {
  const router = useRouter();
  const { data } = useSession();
  // @ts-ignore
  const userId: string = data?.user.id;
  const { formState, inputChangeHandler, restartForm } = useForm(
    {
      server_name: {
        value: "",
        isValid: false,
      },
      server_image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.isValid || !userId) return;

    try {
      const response: {
        message: string;
        serverId: string;
        channelId: string;
      } = await createServer(
        formState.inputs.server_name.value,
        formState.inputs.server_image.value,
        userId,
        `/${userId}`
      );

      if (response.message === "Server created successfully.") {
        restartForm(
          {
            server_name: {
              value: "",
              isValid: false,
            },
            server_image: {
              value: "",
              isValid: false,
            },
          },
          false,
          "create-form"
        );
        closeDialog(dialogId);
        router.push(`/servers/${response.serverId}/${response.channelId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="p-3 text-center">
        <h2 className="text-xl text-white font-bold">Create the Server</h2>
        <p className="mt-3 text-gray-400 font-thin">
          This server is where you and your friends hang out.
        </p>
      </div>
      <div>
        <form
          className="py-3 flex flex-col gap-3 overflow-hidden"
          onSubmit={submitHandler}
          id="create-form"
        >
          <div>
            <ImagesUpload
              id={"server_image"}
              imagePreview={formState.inputs.server_image.value}
              onInputChange={inputChangeHandler}
            />
          </div>
          <div>
            <Input
              elementType={InputElement.INPUT}
              id={"server_name"}
              type={"text"}
              placeholder={"Enter Server Name"}
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
              label="Server Name"
              onInputChange={inputChangeHandler}
              helperText="Please enter a valid server name."
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
              disabled={!formState.isValid}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServerForm;

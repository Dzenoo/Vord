"use client";

import Button from "@/components/shared/form/Button";
import Input, { InputElement } from "@/components/shared/form/Input";
import { createCategory } from "@/lib/actions/servers.actions";
import useForm from "@/lib/hooks/useForm";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "@/lib/validators/Validators";

interface CreateCategoryFormTypes {
  serverId: string;
  channelId: string;
  closeDialog: (dialogId: string) => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormTypes> = ({
  serverId,
  channelId,
  closeDialog,
}) => {
  const { formState, inputChangeHandler, restartForm } = useForm(
    {
      category_name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  async function createCategoryHandler(event: React.FormEvent) {
    event.preventDefault();

    if (!formState.isValid) return;

    try {
      const response = await createCategory(
        serverId,
        formState.inputs.category_name.value,
        `/servers/${serverId}/${channelId}`
      );
      if (response.message === "Category created successfully.") {
        closeDialog("create_category");
        restartForm(
          {
            category_name: {
              value: "",
              isValid: false,
            },
          },
          false,
          "category"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="py-3 flex flex-col gap-6 w-96">
      <div>
        <h2 className="text-xl text-white font-bold">Create Category</h2>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={createCategoryHandler}
        id="category"
      >
        <div>
          <Input
            elementType={InputElement.INPUT}
            id={"category_name"}
            type={"text"}
            placeholder={"Enter category name"}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
            onInputChange={inputChangeHandler}
            label="Category Name"
            helperText="Please enter a valid category name."
          />
        </div>
        <div>
          <Button type="submit" disabled={!formState.isValid} variant="primary">
            Create Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategoryForm;

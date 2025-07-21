"use client";

import Button from "@/components/shared/form/Button";
import Input, { InputElement } from "@/components/shared/form/Input";
import useForm from "@/lib/hooks/useForm";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "@/lib/validators/Validators";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

const LoginForm: React.FC = () => {
  const { formState, inputChangeHandler } = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const router = useRouter();

  async function loginAction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formState.isValid) return;

    try {
      const result = await signIn("credentials", {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <form
      className="p-3 flex flex-col gap-8 w-[400px] max-md:w-fit"
      onSubmit={loginAction}
    >
      <ToastContainer />
      <div className="flex flex-col gap-6">
        <Input
          elementType={InputElement.INPUT}
          id={"email"}
          type={"email"}
          label="Email"
          placeholder={"Enter Email"}
          validators={[VALIDATOR_EMAIL()]}
          onInputChange={inputChangeHandler}
          initialValidity={false}
          helperText="Please enter a valid email address."
        />
        <Input
          elementType={InputElement.INPUT}
          id={"password"}
          type={"password"}
          label="Password"
          placeholder={"Enter Password"}
          validators={[VALIDATOR_MINLENGTH(8)]}
          onInputChange={inputChangeHandler}
          initialValidity={false}
          helperText="Please enter a valid password."
        />
      </div>
      <div>
        <Button variant="primary" type="submit" disabled={!formState.isValid}>
          Log In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;

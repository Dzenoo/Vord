"use client";

import Button from "@/components/shared/form/Button";
import { generateServerInviteLink } from "@/lib/functions";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface InviteServerFormTypes {
  serverId: string;
  closeDialog: (dialogId: string) => void;
}

const InviteToServerForm: React.FC<InviteServerFormTypes> = ({
  serverId,
  closeDialog,
}) => {
  const [isCopied, setisCopied] = useState<boolean>(false);
  const inviteLink = generateServerInviteLink(serverId) as any;

  function copyInviteLink(): void {
    navigator.clipboard
      .writeText(inviteLink)
      .then(function () {
        setisCopied(true);
        closeDialog("invite_people");
      })
      .catch((err) => {
        toast.error(err);
        setisCopied(false);
      });
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-7 w-96">
        <div className="pb-6 flex flex-col gap-3">
          <div>
            <p className="uppercase text-xs text-gray-400 font-bold">
              Send a server invite link to a friend
            </p>
          </div>
          <div className="flex gap-3">
            <input
              readOnly
              className="inputs basis-full border"
              value={`${inviteLink}`}
            />
            <div>
              <Button
                variant={!isCopied ? "secondary" : "primary"}
                type="button"
                onClick={copyInviteLink}
              >
                {!isCopied ? "Copy" : "Copied"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteToServerForm;

"use client";

import { AddCircleOutline, Category } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tab from "@/components/shared/elements/Tab";
import Dialog from "@/components/shared/elements/Dialog";
import InviteToServerForm from "./InviteToServerForm";
import CreateCategoryForm from "../channels/CreateCategoryForm";
import useDialog from "@/lib/hooks/useDialog";
import useToggleOverlay from "@/lib/hooks/useToggleOverlay";

interface ManageServerBarTypes {
  serverName: string;
  serverId: string;
  channelId: string;
  isAdmin: boolean;
}

const ManageServerBar: React.FC<ManageServerBarTypes> = ({
  serverName,
  serverId,
  channelId,
  isAdmin,
}) => {
  const { isOpened, handleToggle, overlayRef } = useToggleOverlay();
  const { dialogs, openDialog, closeDialog } = useDialog({
    invite_people: {
      isOpen: false,
    },
    create_category: {
      isOpen: false,
    },
  });

  return (
    <>
      <Dialog
        isOpen={dialogs.invite_people.isOpen}
        closeDialog={() => closeDialog("invite_people")}
      >
        <InviteToServerForm serverId={serverId} closeDialog={closeDialog} />
      </Dialog>
      <Dialog
        isOpen={dialogs.create_category.isOpen}
        closeDialog={() => closeDialog("create_category")}
      >
        <CreateCategoryForm
          serverId={serverId}
          channelId={channelId}
          closeDialog={closeDialog}
        />
      </Dialog>
      <div
        className="p-3 shadow-md transition-all hover:bg-[#313339] relative cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold">{serverName}</h2>
          </div>
          <div>
            <KeyboardArrowDownIcon
              style={{
                padding: "6px",
                borderRadius: "60px",
                background: "gray",
                transform: isOpened ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>
        <div
          className={`${
            isOpened
              ? "block bg-[#191919] absolute top-16 right-3 left-3 p-3 rounded-md shadow-md animate_opacity"
              : "hidden"
          }`}
          ref={overlayRef}
        >
          <div onClick={() => openDialog("invite_people")}>
            <Tab
              title="Invite People"
              icon={<AddCircleOutline style={{ color: "gray" }} />}
              classNames="w-full text-blue-700"
            />
          </div>
          {isAdmin === true ? (
            <div onClick={() => openDialog("create_category")}>
              <Tab
                title="Create Category"
                icon={<Category style={{ color: "gray" }} />}
                classNames="w-full"
              />
            </div>
          ) : (
            <div>
              <p className="my-3 text-xs text-gray-400 text-center">
                Admins can create category
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageServerBar;

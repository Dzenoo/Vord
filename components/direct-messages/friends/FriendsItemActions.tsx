"use client";
import Tab from "@/components/shared/elements/Tab";
import { useRouter } from "next/navigation";
import { createMessagesDirect } from "@/lib/actions/user.actions";
import { Chat } from "@mui/icons-material";

export interface FriendsItemActionsProps {
  userId: string;
  friendId: string;
}

const FriendsItemActions: React.FC<FriendsItemActionsProps> = ({
  userId,
  friendId,
}) => {
  const router = useRouter();

  async function handleCreateDirect() {
    await createMessagesDirect(userId, friendId);
    router.push(`${userId}/${friendId}?type=chat`);
  }

  return (
    <div className="flex gap-[8px] items-center">
      <div>
        <Tab
          icon={<Chat style={{ color: "#f3f3f3" }} />}
          onClick={handleCreateDirect}
        />
      </div>
    </div>
  );
};

export default FriendsItemActions;

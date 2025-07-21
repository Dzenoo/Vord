import FriendsItemActions from "./FriendsItemActions";

export interface FriendItemProps {
  _id: string;
  username: string;
  image: string;
}

interface FriendsItemPropsAdditional {
  userId: string;
}

const FriendsItem: React.FC<FriendItemProps & FriendsItemPropsAdditional> = ({
  username,
  _id,
  image,
  userId,
}) => {
  return (
    <div className="friend_item flex justify-between items-center p-3 rounded-md transition-all hover:bg-[#191919]">
      <div className="flex gap-3 items-center">
        <div>
          <img
            src={image}
            alt={username}
            className="w-12 h-12 object-cover rounded-full cursor-pointer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-medium">{username}</h2>
            <p className="text-xs text-gray-300 friend_code">
              #{_id.toString().slice(0, 3)}
            </p>
          </div>
        </div>
      </div>
      <FriendsItemActions userId={userId} friendId={_id} />
    </div>
  );
};

export default FriendsItem;

import FriendsItem, { FriendItemProps } from "./FriendsItem";

export interface FriendsListProps {
  userId: string;
  friends: FriendItemProps[];
}

const FriendsList: React.FC<FriendsListProps> = ({ userId, friends }) => {
  return (
    <div className="">
      <div className="py-4">
        <h2 className="text-xs uppercase text-gray-300 font-bold">
          Online: {friends.length}
        </h2>
      </div>
      <div className="py-3 border-t border-gray-700">
        {friends.length === 0 && (
          <p className="text-white text-center">No friends found</p>
        )}
        {friends.map(({ username, image, _id }: FriendItemProps, ind) => (
          <FriendsItem
            key={ind}
            image={image}
            username={username}
            _id={_id}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;

import { Tag } from "@mui/icons-material";

interface ServersDetailsTopbarTypes {
  name: string;
}

const ServersDetailsTopBar: React.FC<ServersDetailsTopbarTypes> = ({
  name,
}) => {
  return (
    <div className="p-[0.6em] flex justify-between items-center gap-6 shadow-md">
      <div className="flex gap-3 items-center">
        <div>
          <Tag style={{ color: "gray" }} />
        </div>
        <div>
          <h2 className="text-white font-bold">{name}</h2>
        </div>
      </div>
    </div>
  );
};

export default ServersDetailsTopBar;

export interface TabProps {
  image?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  classNames?: string;
}

const Tab: React.FC<TabProps> = ({
  title,
  image,
  icon,
  onClick,
  classNames,
}) => {
  return (
    <button
      className={`flex gap-3 items-center p-[7px] rounded-md transition-all hover:bg-[#313339] ${classNames}`}
      onClick={onClick}
    >
      {(image || icon) && (
        <div>
          {image ? (
            <img src={image} alt={title} className="w-9 h-9 rounded-full" />
          ) : (
            icon
          )}
        </div>
      )}
      {title && (
        <div>
          <p className="text-gray-400 whitespace-nowrap">{title}</p>
        </div>
      )}
    </button>
  );
};

export default Tab;

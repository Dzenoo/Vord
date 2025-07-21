export interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-[#313339] p-3 w-fit h-fit shadow-md rounded-md overflow-hidden">
      {children}
    </div>
  );
};

export default Card;

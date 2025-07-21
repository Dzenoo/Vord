import { FadeLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center text-cente w-full">
      <FadeLoader color="#3b47d8" />
    </div>
  );
};

export default Loading;

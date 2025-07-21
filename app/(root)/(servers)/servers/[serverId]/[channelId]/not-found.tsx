import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-3 text-center">
      <h2 className="text-xl text-white">Not Found Page</h2>
      <Link href="/" className="text-xl text-blue-400">
        Home
      </Link>
    </div>
  );
};

export default NotFound;

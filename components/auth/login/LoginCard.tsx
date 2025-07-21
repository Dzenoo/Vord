import Card from "@/components/shared/elements/Card";
import LoginForm from "./LoginForm";
import Link from "next/link";

const LoginCard: React.FC = () => {
  return (
    <Card>
      <div className="p-3">
        <div className="text-center">
          <h2 className="section_title_smaller text-white font-bold">
            Login to your account
          </h2>
        </div>
        <LoginForm />
        <div className="p-3 flex items-center">
          <p className="mr-3 text-gray-400">Need an account?</p>
          <Link
            href="/signup"
            className="text-blue-400 transition-all hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default LoginCard;

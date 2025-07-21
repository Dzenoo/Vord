import Card from "@/components/shared/elements/Card";
import SignupForm from "./SignupForm";
import Link from "next/link";

const SignupCard: React.FC = () => {
  return (
    <Card>
      <div className="p-3">
        <div className="text-center">
          <h2 className="section_title_smaller text-white font-bold">
            Create The Account
          </h2>
        </div>
        <SignupForm />
        <div className="p-3 flex flex-col gap-3">
          <p className="text-xs text-gray-400">
            By registering, you agree to our Terms of Service and Privacy policy
          </p>
          <Link
            href="/login"
            className="text-blue-400 transition-all hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SignupCard;

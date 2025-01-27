import { auth } from "@/auth";
import Signup from "@/components/shared/auth/Signup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignupPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              priority={true}
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Signup />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;

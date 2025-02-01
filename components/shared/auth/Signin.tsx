"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useActionState, useTransition } from "react";
import SubmitBtn from "./SubmitBtn";
import { signInWithCredentials } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const initialState = {
  success: false,
  message: "",
};

const Signin = () => {
  const [state, action] = useActionState(signInWithCredentials, initialState);

  const [isPending, startTransition] = useTransition();

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      {/* <input type="hidden" name="callbackUrl" value={callbackUrl} /> */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <SubmitBtn label="sign in" />
        </div>

        <div>
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        </div>

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link target="_self" className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>

        {state.message && (
          <div
            className={cn(
              "text-center text-sm p-2",
              state.success ? "text-green-600" : "text-red-600"
            )}
          >
            {state.message}
          </div>
        )}
      </div>
    </form>
  );
};

export default Signin;

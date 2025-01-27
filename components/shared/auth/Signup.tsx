"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useActionState } from "react";
import SubmitBtn from "./SubmitBtn";
import { signInWithCredentials, signUpWithCredentials } from "@/actions/auth";
import { cn } from "@/lib/utils";

const initialState = {
  success: false,
  message: "",
};

const Signup = () => {
  const [state, action] = useActionState(signUpWithCredentials, initialState);

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            type="text"
            autoComplete="name"
          />
        </div>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <SubmitBtn label="sign up" />
        </div>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link target="_self" className="link" href="/sign-in">
            Sign In
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

export default Signup;

"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      variant="default"
      type="submit"
      disabled={pending}
    >
      {pending ? "Loading..." : "Sign In"}
    </Button>
  );
};

export default SubmitBtn;

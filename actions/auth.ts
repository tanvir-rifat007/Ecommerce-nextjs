"use server";

import { signIn } from "@/auth";
import { signInFormSchema } from "@/lib/validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function signInWithCredentials(
  prevState: any,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "You have been signed in" };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    return {
      success: false,
      message: "Invalid Credentials!",
    };
  }
}

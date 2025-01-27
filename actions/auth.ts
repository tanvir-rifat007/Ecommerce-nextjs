"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/db";
import { signInFormSchema, signUpFormSchema } from "@/lib/validator";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

export async function signOutCurrentUser() {
  return await signOut();
}

export async function signUpWithCredentials(
  prevState: any,
  formData: FormData
) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      password: formData.get("password"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.log(error.errors);

    //zod error:
    if (error.errors) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    if (error.code === "P2002") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

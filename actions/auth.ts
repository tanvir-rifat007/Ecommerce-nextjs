"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/db";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/validator";
import { PaymentMethod, ShippingAddress } from "@/types";
import { hashSync } from "bcrypt-ts-edge";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { memoize } from "nextjs-better-unstable-cache";

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

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address: address,
      },
    });

    revalidateTag(`user:${currentUser.id}`);

    return {
      success: true,

      message: "User updated successfully!",
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const updateUserPaymentMethod = async (data: PaymentMethod) => {
  try {
    const paymentMethod = paymentMethodSchema.parse(data);

    const session = await auth();

    const id = session?.user?.id;

    if (!id) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // find the user;

    const currentUser = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });

    revalidateTag(`user:${currentUser.id}`);

    return {
      success: true,
      message: "Payment method updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

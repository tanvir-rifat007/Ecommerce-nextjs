"use server";

import { auth } from "@/auth";
import { getUserById } from "./auth";
import { getMyCart } from "./cart";
import { insertOrderSchema } from "@/lib/validator";
import { prisma } from "@/db/db";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { memoize } from "nextjs-better-unstable-cache";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    console.log("user", user);

    if (!user) throw new Error("User not found");

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "Please add a shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Please select a payment method",
        redirectTo: "/payment-method",
      };
    }

    const order = {
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    };

    console.log("order", order);

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order successfully created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "error creatiing order" };
  }
}

export const getOrderByID = memoize(
  async (id: string) => {
    const res = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!res) throw new Error("Order not found");

    // return the decimal object as a string
    res.totalPrice = String(res.totalPrice);
    res.itemsPrice = String(res.itemsPrice);
    res.shippingPrice = String(res.shippingPrice);
    res.taxPrice = String(res.taxPrice);
    res.orderItems = res.orderItems.map((item) => {
      item.price = String(item.price);
      return item;
    });
    return res;
  },
  {
    persist: true,
    revalidateTags: (id: string) => [`order:${id}`],
    log: ["datacache", "dedupe", "verbose"],
  }
);

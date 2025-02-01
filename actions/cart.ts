"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/db";
import { round2 } from "@/lib/utils";
import { cartItemSchema, insertCartSchema } from "@/lib/validator";
import { CartItem } from "@/types";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addToCart = async (data: CartItem) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Session cart id not found");
    }

    // get the logged in user id from session:

    const session = await auth();

    const userId = session?.user?.id ? session.user.id : undefined;

    // get user cart from db using sessionCartId if the user is guest user and userId if the user is logged in:

    const cart = await getMyCart();
    console.log("cart", cart);
    const item = cartItemSchema.parse(data);
    // console.log("item", item);

    // fetch from the db:
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    console.log("product", product);

    if (!product) throw new Error("Product not found");

    if (!cart) {
      console.log("I am here in cart");
      // Create new cart object
      const newCart = {
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      };

      console.log("newCart", newCart);
      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      revalidateTag(`product:${item.slug}`);

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    }

    // Check if item already exists in the cart
    else {
      // Check for existing item in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      // If not enough stock, throw error
      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase quantity of existing item
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // If stock, add item to cart
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidateTag(`product:${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart successfully`,
      };
    }

    // console.log({
    //   "session.cart.id": sessionCartId,
    //   "user.id": userId,
    //   item,
    //   cart,
    //   fetchProduct,
    // });

    // return {
    //   success: true,
    //   message: "Added to cart",
    //   cart,
    //   item,
    // };
  } catch (err) {
    return {
      success: false,
      message: "Failed to add to cart",
    };
  }
};

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Session cart id not found");
  }

  // get the logged in user id from session:

  const session = await auth();

  const userId = session?.user?.id ? session.user.id : undefined;

  // get user cart from db using sessionCartId if the user is guest user and userId if the user is logged in:

  const cart = await prisma.cart.findFirst({
    where: userId
      ? {
          userId: userId,
        }
      : {
          sessionCartId: sessionCartId,
        },
  });

  return cart;
}

export async function removeItemFromCart(productId: string) {
  try {
    // Get session cart id
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Check if cart has item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    // Check if cart has only one item
    if (exist.qty === 1) {
      // Remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease quantity of existing item
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    // Revalidate product page
    revalidateTag(`product:${product.slug}`);

    return {
      success: true,
      message: `${product.name}  ${
        (cart.items as CartItem[]).find((x) => x.productId === productId)
          ? "updated in"
          : "removed from"
      } cart successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to remove item from cart",
    };
  }
}

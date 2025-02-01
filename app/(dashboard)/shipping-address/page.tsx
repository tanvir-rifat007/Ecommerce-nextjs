import { getUserById } from "@/actions/auth";
import { getMyCart } from "@/actions/cart";
import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const user = await getUserById(userId);

  return <>Shipping Page</>;
};

export default ShippingAddressPage;

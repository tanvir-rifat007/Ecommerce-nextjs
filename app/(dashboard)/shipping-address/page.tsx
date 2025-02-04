import { getUserById } from "@/actions/auth";
import { getMyCart } from "@/actions/cart";
import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkoutSteps/checkoutSteps";
import ShippingAddress from "@/components/shared/shippingAddress/shippingAddress";
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

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddress address={user?.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;

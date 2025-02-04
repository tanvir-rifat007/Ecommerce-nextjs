import { getUserById } from "@/actions/auth";
import { auth } from "@/auth";
import { Metadata } from "next";
import CheckoutSteps from "@/components/shared/checkoutSteps/checkoutSteps";
import PaymentMethodForm from "@/components/shared/paymentMethod/paymentMethod";

export const metadata: Metadata = {
  title: "Payment Method",
};

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default page;

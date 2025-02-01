import { getMyCart } from "@/actions/cart";
import CartTable from "@/components/shared/Cart/CartTable";
import React from "react";

const cartPage = async () => {
  const cart = await getMyCart();

  const newCart = {
    ...cart,
    itemsPrice: String(cart?.itemsPrice),
    shippingPrice: String(cart?.shippingPrice),
    taxPrice: String(cart?.taxPrice),
    totalPrice: String(cart?.totalPrice),
  };
  return (
    <div>
      <CartTable cart={newCart} />
    </div>
  );
};

export default cartPage;

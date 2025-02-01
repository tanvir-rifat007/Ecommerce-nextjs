"use client";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { addToCart, removeItemFromCart } from "@/actions/cart";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(async () => {
      const { success, message } = await addToCart(item);

      console.log(success, message);

      if (success) {
        return toast({
          description: message,
          action: (
            <ToastAction
              altText="View Cart"
              onClick={() => router.push("/cart")}
            >
              View Cart
            </ToastAction>
          ),
        });
      }

      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const { success, message } = await removeItemFromCart(item.productId);

      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "success" : "destructive",
      });
    });
  };

  const existItem =
    cart && cart?.items?.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>

      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;

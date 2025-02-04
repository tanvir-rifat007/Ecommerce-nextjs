"use client";

import { createOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const PlaceOrderBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          const res = await createOrder();

          console.log(res);

          if (!res.success) {
            toast({
              variant: "destructive",
              description: res.message,
            });
          }

          if (res.redirectTo) {
            router.push(res.redirectTo);
          }
        });
      }}
    >
      {isPending ? "Placing Order..." : "Place Order"}
    </Button>
  );
};

export default PlaceOrderBtn;

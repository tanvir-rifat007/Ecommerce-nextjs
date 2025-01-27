import { Button } from "@/components/ui/button";
import Toogle from "./toogle";
import Link from "next/link";
import {
  EllipsisVertical,
  MenuIcon,
  ShoppingCart,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./userButton";
import { SessionProvider } from "next-auth/react";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full gap-1 max-w-xs">
        <Toogle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>
        <SessionProvider>
          {" "}
          <UserButton />
        </SessionProvider>
      </nav>

      {/* mobile or small device  */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <MenuIcon />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <Toogle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart />
                Cart
              </Link>
            </Button>
            <SessionProvider>
              <UserButton />
            </SessionProvider>

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

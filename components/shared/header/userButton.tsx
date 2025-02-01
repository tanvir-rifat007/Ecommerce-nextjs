"use client";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutCurrentUser } from "@/actions/auth";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const UserButton = () => {
  const session = useSession();

  const [isPending, startTransition] = useTransition();

  if (!session.data) {
    return (
      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const firstInitial = session.data?.user?.name?.charAt(0).toUpperCase() ?? "";
  const googleProfile = session.data?.user?.image;

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            {googleProfile ? (
              <Image
                src={googleProfile}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <Button
                variant="ghost"
                className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300"
              >
                {firstInitial}
              </Button>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.data?.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.data?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem className="p-0 mb-1">
            <Button
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
              onClick={() => {
                startTransition(async () => {
                  await signOutCurrentUser();
                });
              }}
            >
              {isPending ? "Signing out..." : "Sign Out"}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

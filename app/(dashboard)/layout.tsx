import Header from "@/components/shared/header";
import { PropsWithChildren } from "react";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
    </div>
  );
};

export default RootLayout;

import { SignOutButton } from "@/components/AuthButtons";
import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserHeader from "./_components/header";
import CardTemplate from "@/components/card-template";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <UserHeader />
        <div className="mt-6">
          <CardTemplate>{children}</CardTemplate>
        </div>
      </div>
    </div>
  );
};

export default Layout;

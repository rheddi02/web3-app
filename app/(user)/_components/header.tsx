import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/AuthButtons";
import UserNavigation from "./navigation";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UserNavigationMobile from "./navigationMobile";

export default async function UserHeader() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "hidden sm:flex items-center justify-center gap-2 bg-muted size-14 mr-1 rounded-full overflow-hidden",
              !session.user?.image && "border-2"
            )}
          >
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="User"
                width={64}
                height={64}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground">
              User Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-bold">{session.user?.name || session.user?.email}</span>
            </p>
          </div>
        </div>
        <div className="sm:block hidden">
          <SignOutButton />
        </div>
        <div className="sm:hidden block">
          <UserNavigationMobile />
        </div>
      </div>
      <div className="hidden sm:block">
        <UserNavigation />
      </div>
    </>
  );
}

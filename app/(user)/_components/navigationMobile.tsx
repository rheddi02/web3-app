"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, Home, User, UserPlus } from "lucide-react";
import { signOut } from "next-auth/react";
import { Routes } from "@/utils/constant.utils";
import { cn } from "@/lib/utils";

export default function UserNavigationMobile() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const getIcon = (title: string) => {
    switch (title) {
      case "Dashboard":
        return <Home className="w-5 h-5" />;
      case "Account":
        return <User className="w-5 h-5" />;
      case "Invite":
        return <UserPlus className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-background border border-border shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Menu</h2>
          
          <nav className="space-y-2">
            {Routes.map((route) => (
              <button
                key={route.title}
                onClick={() => {
                  router.push(route.href);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                {getIcon(route.title)}
                <div>
                  <div className="font-medium">{route.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {route.description}
                  </div>
                </div>
              </button>
            ))}
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors text-left mt-4 border-t border-border pt-4"
            >
              <LogOut className="w-5 h-5" />
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-sm text-muted-foreground">
                  Sign out of your account
                </div>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

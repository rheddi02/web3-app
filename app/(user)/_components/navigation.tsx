"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import CardTemplate from "@/components/card-template";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Routes } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function UserNavigation() {
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();
  const router = useRouter();
  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Routes.map((route) => (
        <div
            key={route.title}
            onClick={() => {
            router.push(route.href);
          }}
        >
          <CardTemplate
            className={cn(
              "md:p-6 p-4",
              "hover:scale-105 transition-all duration-300 cursor-pointer ",
              segment === route.href ? "bg-secondary text-secondary-foreground" : "bg-disabled"
            )}
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-2 flex items-center justify-between">
              {route.title}
              <Link href={route.href}>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </h3>
            <p className="text-muted-foreground">{route.description}</p>
          </CardTemplate>
        </div>
      ))}
    </nav>
  );
}

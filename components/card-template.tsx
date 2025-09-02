import { cn } from "@/lib/utils";
import React from "react";

const CardTemplate = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("border p-6 rounded-lg text-card-foreground bg-card", className)}>
      {children}
    </div>
  );
};

export default CardTemplate;

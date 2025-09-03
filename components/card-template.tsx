import { cn } from "@/lib/utils";
import React from "react";

const CardTemplate = ({
  children,
  className,
  isInvited,
  isInviteCard,
}: {
  children: React.ReactNode;
  className?: string;
  isInvited?: boolean;
  isInviteCard?: boolean;
}) => {
  return (
    <div className={cn("border rounded-lg text-card-foreground bg-card", isInviteCard && !isInvited && 'border-l-8 border-l-emerald-600', isInviteCard && isInvited && 'border-l-8 border-l-amber-600')}>
      <div className={cn("p-6", className)}>{children}</div>
    </div>
  );
};

export default CardTemplate;

import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-green-100 text-green-700",
  secondary: "bg-gray-100 text-gray-700",
  outline: "border border-gray-200 text-gray-700",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

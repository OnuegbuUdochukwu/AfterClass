import * as React from "react"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-base)] border border-border bg-surface text-foreground transition-shadow hover:shadow-lg dark:hover:shadow-black/50 overflow-hidden",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "stat"
  accentColor?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", accentColor, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl overflow-hidden transition-all",
        {
          "border border-outline-variant/20 bg-surface-container-low text-on-surface hover:border-outline-variant/40":
            variant === "default",
          "glass-card rounded-xl text-on-surface":
            variant === "glass",
          "glass-card rounded-xl text-on-surface border-l-4":
            variant === "stat",
        },
        className
      )}
      style={
        variant === "stat" && accentColor
          ? { borderLeftColor: accentColor, ...style }
          : style
      }
      {...props}
    />
  )
)
Card.displayName = "Card"

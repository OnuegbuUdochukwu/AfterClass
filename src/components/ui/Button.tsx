import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-white hover:bg-primary-hover rounded-[var(--radius-base)] px-4 py-2":
              variant === "primary",
            "border border-border bg-transparent hover:bg-surface-light dark:hover:bg-surface-dark rounded-[var(--radius-base)] px-4 py-2":
              variant === "secondary",
            "bg-primary-ghost text-primary hover:bg-primary-ghost-hover rounded-[var(--radius-pill)] px-4 py-2":
              variant === "ghost",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

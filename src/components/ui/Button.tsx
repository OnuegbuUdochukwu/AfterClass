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
          "inline-flex items-center justify-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "bg-[#7F56D9] text-white hover:bg-[#6941C6] rounded-lg px-4 py-2 shadow-lg shadow-violet-500/20":
              variant === "primary",
            "border border-outline-variant bg-transparent hover:bg-surface-container-high text-on-surface rounded-lg px-4 py-2":
              variant === "secondary",
            "bg-violet-500/10 text-violet-400 hover:bg-violet-500/15 rounded-full px-4 py-2":
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

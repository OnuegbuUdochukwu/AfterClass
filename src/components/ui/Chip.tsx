import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, active = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold transition-colors",
          active
            ? "bg-primary-ghost text-primary"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          className
        )}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

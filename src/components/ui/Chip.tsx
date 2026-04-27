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
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
          active
            ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
            : "bg-surface-container-high text-slate-300 border border-outline-variant/30 hover:bg-surface-container-highest hover:text-slate-200",
          className
        )}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

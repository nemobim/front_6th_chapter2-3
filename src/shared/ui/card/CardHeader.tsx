import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} ref={ref} {...props} />
))

CardHeader.displayName = "CardHeader"

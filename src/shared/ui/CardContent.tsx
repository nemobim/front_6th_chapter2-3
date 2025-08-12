import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />
))

CardContent.displayName = "CardContent"

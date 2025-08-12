import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} ref={ref} {...props} />
))

Card.displayName = "Card"

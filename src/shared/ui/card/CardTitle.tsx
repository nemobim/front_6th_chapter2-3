import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} ref={ref} {...props} />
))

CardTitle.displayName = "CardTitle"

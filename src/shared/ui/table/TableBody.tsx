import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} ref={ref} {...props} />
))

TableBody.displayName = "TableBody"

import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    ref={ref}
    {...props}
  />
))

TableHead.displayName = "TableHead"

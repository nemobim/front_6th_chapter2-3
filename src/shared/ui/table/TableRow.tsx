import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    ref={ref}
    {...props}
  />
))

TableRow.displayName = "TableRow"

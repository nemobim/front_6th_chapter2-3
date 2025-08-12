import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} ref={ref} {...props} />
))

TableCell.displayName = "TableCell"

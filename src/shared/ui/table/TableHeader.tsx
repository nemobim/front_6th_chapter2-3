import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead className={cn("[&_tr]:border-b", className)} ref={ref} {...props} />
))

TableHeader.displayName = "TableHeader"

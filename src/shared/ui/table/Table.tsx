import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} ref={ref} {...props} />
  </div>
))

Table.displayName = "Table"

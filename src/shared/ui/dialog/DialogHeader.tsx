import { forwardRef } from "react"

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} ref={ref} {...props} />
))

DialogHeader.displayName = "DialogHeader"

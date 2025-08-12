import { ReactNode } from "react"

import { QueryProvider } from "./QueryProvider"
import { RouterProvider } from "./RouterProvider"

interface AppProvidersProps {
  children: ReactNode
}
export function AppProvider({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <RouterProvider>{children}</RouterProvider>
    </QueryProvider>
  )
}

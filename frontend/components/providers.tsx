"use client"

import { ThemeProvider } from "@/hooks/use-theme"
import { AuthProvider } from "@/contexts/auth-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

"use client"

import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="antialiased" suppressHydrationWarning>{children}</div>
      </ThemeProvider>
    </AuthProvider>
  )
}

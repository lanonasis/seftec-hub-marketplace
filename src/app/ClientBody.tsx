"use client";

import { AuthProvider } from "@/lib/auth-context";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="antialiased">{children}</div>
    </AuthProvider>
  );
}

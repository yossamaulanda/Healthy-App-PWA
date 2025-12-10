'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch setiap 5 menit
      refetchOnWindowFocus={true}
      // Tambahkan basePath untuk memastikan konsistensi dengan NEXTAUTH_URL
      basePath={typeof window !== 'undefined' ? undefined : process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth` : undefined}
    >
      {children}
    </SessionProvider>
  )
}

'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
      // Tambahkan basePath eksplisit untuk konsistensi
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}

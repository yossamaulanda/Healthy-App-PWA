// app/dashboard/layout.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('Dashboard Layout - Session Status:', status)
    console.log('Dashboard Layout - Session Data:', session)
    
    if (status === 'unauthenticated') {
      console.log('Dashboard Layout - Redirecting to login - unauthenticated')
      router.push('/login')
    }
  }, [status, router, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat Dashboard Layout...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    console.log('Dashboard Layout - No session, returning null')
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Session tidak ditemukan di layout</p>
        </div>
      </div>
    )
  }

  console.log('Dashboard Layout - Rendering children')
  return <>{children}</>
}

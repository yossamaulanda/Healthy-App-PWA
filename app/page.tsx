'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Masih loading, tunggu

    if (session) {
      // Jika sudah login, arahkan ke dashboard
      router.push('/dashboard')
    } else {
      // Jika belum login, arahkan ke halaman login
      router.push('/login')
    }
  }, [session, status, router])

  // Loading state saat mengecek status autentikasi
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memeriksa status login...</p>
      </div>
    </div>
  )
}
